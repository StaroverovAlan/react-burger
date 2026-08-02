import { createSlice } from '@reduxjs/toolkit';

import { fetchOrderByNumber } from './actions';

import type { TOrder } from '@utils/types';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null,
};

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  selectors: {
    getOrderInfo: (state): TOrder | null => state.order,
    getOrderInfoLoading: (state): boolean => state.isLoading,
    getOrderInfoError: (state): string | null => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearOrderInfo } = orderInfoSlice.actions;

export const { getOrderInfo, getOrderInfoLoading, getOrderInfoError } =
  orderInfoSlice.selectors;
