import { createAsyncThunk } from '@reduxjs/toolkit';

import { forgotPasswordApi, resetPasswordApi } from '@utils/api';

export const forgotPassword = createAsyncThunk(
  'password/forgotPassword',
  forgotPasswordApi
);

export const resetPassword = createAsyncThunk(
  'password/resetPassword',
  resetPasswordApi
);
