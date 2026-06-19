import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './actions';

type TOrderState = {
  orderNumber: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderNumber: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.error = null;
    },
  },
  selectors: {
    getOrderNumber: (state): number | null => state.orderNumber,
    getOrderLoading: (state): boolean => state.isLoading,
    getOrderError: (state): string | null => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось создать заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const { getOrderNumber, getOrderLoading, getOrderError } = orderSlice.selectors;
