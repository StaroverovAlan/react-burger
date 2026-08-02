import { createSlice } from '@reduxjs/toolkit';

import { createInitialOrdersState } from '@services/orders/state';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrdersResponse } from '@utils/types';

export const feedSlice = createSlice({
  name: 'feed',
  initialState: createInitialOrdersState(),
  reducers: {
    feedConnect: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    feedDisconnect: (state) => {
      state.isConnected = false;
      state.isLoading = false;
    },
    feedOpen: (state) => {
      state.isConnected = true;
      state.isLoading = false;
      state.error = null;
    },
    feedMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
      state.isLoading = false;
    },
    feedError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    feedClose: (state) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedTotal: (state) => state.total,
    getFeedTotalToday: (state) => state.totalToday,
    getFeedConnected: (state) => state.isConnected,
    getFeedLoading: (state) => state.isLoading,
    getFeedError: (state) => state.error,
  },
});

export const {
  feedConnect,
  feedDisconnect,
  feedOpen,
  feedMessage,
  feedError,
  feedClose,
} = feedSlice.actions;

export const {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedConnected,
  getFeedLoading,
  getFeedError,
} = feedSlice.selectors;
