import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  clearAuthTokens,
  getUserApi,
  loginApi,
  logoutApi,
  registerApi,
  saveAuthTokens,
  updateUserApi,
} from '@utils/api';
import { isTokenExists } from '@utils/tokens';

import type {
  TLoginRequest,
  TRegisterRequest,
  TUpdateUserRequest,
  TUser,
} from '@utils/types';

export const registerUser = createAsyncThunk<TUser, TRegisterRequest>(
  'auth/registerUser',
  async (data) => {
    const response = await registerApi(data);

    saveAuthTokens(response);

    return response.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginRequest>(
  'auth/loginUser',
  async (data) => {
    const response = await loginApi(data);

    saveAuthTokens(response);

    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk<TUser | null>(
  'auth/checkUserAuth',
  async () => {
    if (!isTokenExists()) {
      return null;
    }

    const response = await getUserApi();

    return response.user;
  }
);

export const updateUser = createAsyncThunk<TUser, TUpdateUserRequest>(
  'auth/updateUser',
  async (data) => {
    const response = await updateUserApi(data);

    return response.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await logoutApi();
  } finally {
    clearAuthTokens();
  }
});
