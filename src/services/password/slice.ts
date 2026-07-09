import { createSlice } from '@reduxjs/toolkit';

import { forgotPassword, resetPassword } from './actions';

type TPasswordState = {
  isLoading: boolean;
  error: string | null;
};

const initialState: TPasswordState = {
  isLoading: false,
  error: null,
};

export const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearPasswordError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    getPasswordLoading: (state): boolean => state.isLoading,
    getPasswordError: (state): string | null => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось отправить письмо';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось сохранить пароль';
      });
  },
});

export const { clearPasswordError } = passwordSlice.actions;
export const { getPasswordLoading, getPasswordError } = passwordSlice.selectors;
