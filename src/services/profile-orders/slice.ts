import { createSlice } from '@reduxjs/toolkit';

import { createInitialOrdersState } from '@services/orders/state';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrdersResponse } from '@utils/types';

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState: createInitialOrdersState(),
  reducers: {
    profileOrdersConnect: (state) => {
      state.isLoading = true;
      state.error = null;
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    profileOrdersDisconnect: (state) => {
      state.isConnected = false;
      state.isLoading = false;
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    profileOrdersOpen: (state) => {
      state.isConnected = true;
      state.isLoading = false;
      state.error = null;
    },
    profileOrdersMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
      state.isLoading = false;
    },
    profileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    profileOrdersClose: (state) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersConnected: (state) => state.isConnected,
    getProfileOrdersLoading: (state) => state.isLoading,
    getProfileOrdersError: (state) => state.error,
  },
});

export const {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOpen,
  profileOrdersMessage,
  profileOrdersError,
  profileOrdersClose,
} = profileOrdersSlice.actions;

export const {
  getProfileOrders,
  getProfileOrdersConnected,
  getProfileOrdersLoading,
  getProfileOrdersError,
} = profileOrdersSlice.selectors;
