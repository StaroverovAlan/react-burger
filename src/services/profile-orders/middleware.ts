import { createWebSocketMiddleware } from '@services/websocket/middleware';
import { refreshAuthToken } from '@utils/api';
import { WS_URL } from '@utils/constants';
import { isOrdersResponse } from '@utils/order-guards';
import { getAccessToken } from '@utils/tokens';

import {
  profileOrdersClose,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersError,
  profileOrdersMessage,
  profileOrdersOpen,
} from './slice';

const getTokenForWebSocket = (): string | null => {
  return getAccessToken()?.replace('Bearer ', '') ?? null;
};

export const profileOrdersMiddleware = createWebSocketMiddleware({
  actions: {
    connectType: profileOrdersConnect.type,
    disconnectType: profileOrdersDisconnect.type,
    onOpen: profileOrdersOpen,
    onMessage: profileOrdersMessage,
    onError: profileOrdersError,
    onClose: profileOrdersClose,
  },
  getUrl: () => {
    const token = getTokenForWebSocket();

    return token ? `${WS_URL}?token=${token}` : null;
  },
  isMessage: isOrdersResponse,
  refreshToken: refreshAuthToken,
});
