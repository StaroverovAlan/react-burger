import { createWebSocketMiddleware } from '@services/websocket/middleware';
import { WS_URL } from '@utils/constants';
import { isOrdersResponse } from '@utils/order-guards';

import {
  feedClose,
  feedConnect,
  feedDisconnect,
  feedError,
  feedMessage,
  feedOpen,
} from './slice';

export const feedMiddleware = createWebSocketMiddleware({
  actions: {
    connectType: feedConnect.type,
    disconnectType: feedDisconnect.type,
    onOpen: feedOpen,
    onMessage: feedMessage,
    onError: feedError,
    onClose: feedClose,
  },
  getUrl: () => `${WS_URL}/all`,
  isMessage: isOrdersResponse,
  refreshOnMessage: (message) =>
    message.orders.some((order) => {
      const createdAt = new Date(order.createdAt).getTime();
      const isRecent = Date.now() - createdAt < 600000;

      return isRecent && order.status !== 'done';
    }),
  refreshOnMessagePeriod: 5000,
});
