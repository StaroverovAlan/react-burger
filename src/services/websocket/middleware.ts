import { isInvalidTokenError, isWebSocketErrorResponse } from '@utils/order-guards';

import type { Middleware, UnknownAction } from '@reduxjs/toolkit';

type TActionCreatorWithoutPayload = () => UnknownAction;
type TActionCreatorWithPayload<TPayload> = (payload: TPayload) => UnknownAction;

type TWebSocketActions<TMessage> = {
  connectType: string;
  disconnectType: string;
  onOpen: TActionCreatorWithoutPayload;
  onMessage: TActionCreatorWithPayload<TMessage>;
  onError: TActionCreatorWithPayload<string>;
  onClose: TActionCreatorWithoutPayload;
};

type TCreateWebSocketMiddlewareOptions<TMessage> = {
  actions: TWebSocketActions<TMessage>;
  getUrl: () => string | null;
  isMessage: (data: unknown) => data is TMessage;
  refreshToken?: () => Promise<unknown>;
  reconnectPeriod?: number;
  refreshOnMessage?: (message: TMessage) => boolean;
  refreshOnMessagePeriod?: number;
};

const DEFAULT_RECONNECT_PERIOD = 3000;
const DEFAULT_REFRESH_ON_MESSAGE_PERIOD = 10000;

const isAction = (action: unknown): action is UnknownAction => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string'
  );
};

export const createWebSocketMiddleware = <TMessage>({
  actions,
  getUrl,
  isMessage,
  refreshToken,
  reconnectPeriod = DEFAULT_RECONNECT_PERIOD,
  refreshOnMessage,
  refreshOnMessagePeriod = DEFAULT_REFRESH_ON_MESSAGE_PERIOD,
}: TCreateWebSocketMiddlewareOptions<TMessage>): Middleware => {
  let socket: WebSocket | null = null;
  let shouldReconnect = false;
  let reconnectTimerId: ReturnType<typeof setTimeout> | null = null;
  let refreshTimerId: ReturnType<typeof setTimeout> | null = null;
  const preventReconnectSockets = new WeakSet<WebSocket>();

  const clearReconnectTimer = (): void => {
    if (reconnectTimerId) {
      clearTimeout(reconnectTimerId);
      reconnectTimerId = null;
    }
  };

  const clearRefreshTimer = (): void => {
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
      refreshTimerId = null;
    }
  };

  const cleanupSocketHandlers = (currentSocket: WebSocket): void => {
    currentSocket.onopen = null;
    currentSocket.onmessage = null;
    currentSocket.onerror = null;
    currentSocket.onclose = null;
  };

  return (store) => {
    const closeSocketWithoutReconnect = (reason: string): void => {
      clearReconnectTimer();
      clearRefreshTimer();

      if (socket) {
        const currentSocket = socket;
        preventReconnectSockets.add(currentSocket);
        socket = null;
        cleanupSocketHandlers(currentSocket);
        currentSocket.close(1000, reason);
      }
    };

    const connectSocket = (): void => {
      clearReconnectTimer();
      clearRefreshTimer();

      const url = getUrl();

      if (!url) {
        store.dispatch(actions.onError('Не удалось сформировать WebSocket URL'));
        return;
      }

      closeSocketWithoutReconnect('Reconnect before new connection');

      const currentSocket = new WebSocket(url);
      socket = currentSocket;

      currentSocket.onopen = (): void => {
        store.dispatch(actions.onOpen());
      };

      currentSocket.onmessage = (event: MessageEvent<string>): void => {
        if (event.data === 'ping') {
          currentSocket.send('pong');
          return;
        }

        try {
          const data: unknown = JSON.parse(event.data);

          if (refreshToken && isInvalidTokenError(data)) {
            void refreshToken()
              .then(() => {
                preventReconnectSockets.add(currentSocket);
                currentSocket.close(1000, 'Token refreshed');

                if (socket === currentSocket) {
                  socket = null;
                }

                connectSocket();
              })
              .catch(() => {
                store.dispatch(actions.onError('Не удалось обновить токен'));
              });

            return;
          }

          if (isMessage(data)) {
            store.dispatch(actions.onMessage(data));

            if (refreshOnMessage?.(data)) {
              clearRefreshTimer();

              refreshTimerId = setTimeout(() => {
                if (shouldReconnect && socket === currentSocket) {
                  connectSocket();
                }
              }, refreshOnMessagePeriod);
            }

            return;
          }

          if (isWebSocketErrorResponse(data)) {
            store.dispatch(actions.onError(data.message));
            return;
          }

          store.dispatch(actions.onError('Некорректные данные WebSocket'));
        } catch {
          store.dispatch(actions.onError('Ошибка парсинга WebSocket-сообщения'));
        }
      };

      currentSocket.onerror = (): void => {
        store.dispatch(actions.onError('Ошибка WebSocket-соединения'));
      };

      currentSocket.onclose = (): void => {
        const isIntentionalClose = preventReconnectSockets.has(currentSocket);

        if (!isIntentionalClose) {
          store.dispatch(actions.onClose());
        }

        if (socket === currentSocket) {
          socket = null;
        }

        if (shouldReconnect && !isIntentionalClose) {
          reconnectTimerId = setTimeout(connectSocket, reconnectPeriod);
        }
      };
    };

    const disconnectSocket = (): void => {
      shouldReconnect = false;
      closeSocketWithoutReconnect('Manual disconnect');
      store.dispatch(actions.onClose());
    };

    return (next) => (action) => {
      if (!isAction(action)) {
        return next(action);
      }

      if (action.type === actions.connectType) {
        shouldReconnect = true;
        connectSocket();
      }

      if (action.type === actions.disconnectType) {
        disconnectSocket();
      }

      return next(action);
    };
  };
};
