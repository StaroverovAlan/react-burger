import { describe, expect, it } from 'vitest';

import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from './actions';
import { authSlice } from './slice';

import type {
  TLoginRequest,
  TRegisterRequest,
  TUpdateUserRequest,
  TUser,
} from '@utils/types';

const reducer = authSlice.reducer;

const user: TUser = {
  email: 'user@example.com',
  name: 'Алан',
};

const loginRequest: TLoginRequest = {
  email: 'user@example.com',
  password: 'password',
};

const registerRequest: TRegisterRequest = {
  ...loginRequest,
  name: 'Алан',
};

const updateUserRequest: TUpdateUserRequest = {
  name: 'Новый Алан',
};

describe('authSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает registerUser.pending', (): void => {
    const result = reducer(
      undefined,
      registerUser.pending('requestId', registerRequest)
    );

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает registerUser.fulfilled', (): void => {
    const result = reducer(
      undefined,
      registerUser.fulfilled(user, 'requestId', registerRequest)
    );

    expect(result).toEqual({
      user,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает registerUser.rejected', (): void => {
    const result = reducer(
      undefined,
      registerUser.rejected(
        new Error('Ошибка регистрации'),
        'requestId',
        registerRequest
      )
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка регистрации');
  });

  it('обрабатывает loginUser.pending', (): void => {
    const result = reducer(undefined, loginUser.pending('requestId', loginRequest));

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает loginUser.fulfilled', (): void => {
    const result = reducer(
      undefined,
      loginUser.fulfilled(user, 'requestId', loginRequest)
    );

    expect(result).toEqual({
      user,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает loginUser.rejected', (): void => {
    const result = reducer(
      undefined,
      loginUser.rejected(new Error('Ошибка входа'), 'requestId', loginRequest)
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка входа');
  });

  it('обрабатывает checkUserAuth.pending', (): void => {
    const result = reducer(
      {
        user,
        isAuthChecked: true,
        isLoading: false,
        error: null,
      },
      checkUserAuth.pending('requestId', undefined)
    );

    expect(result.isAuthChecked).toBe(false);
  });

  it('обрабатывает checkUserAuth.fulfilled', (): void => {
    const result = reducer(
      undefined,
      checkUserAuth.fulfilled(user, 'requestId', undefined)
    );

    expect(result.user).toEqual(user);
    expect(result.isAuthChecked).toBe(true);
  });

  it('обрабатывает checkUserAuth.rejected', (): void => {
    const result = reducer(
      {
        user,
        isAuthChecked: false,
        isLoading: false,
        error: null,
      },
      checkUserAuth.rejected(new Error('Ошибка проверки'), 'requestId', undefined)
    );

    expect(result.user).toBeNull();
    expect(result.isAuthChecked).toBe(true);
  });

  it('обрабатывает updateUser.pending', (): void => {
    const result = reducer(
      undefined,
      updateUser.pending('requestId', updateUserRequest)
    );

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает updateUser.fulfilled', (): void => {
    const updatedUser: TUser = { ...user, name: 'Новый Алан' };
    const result = reducer(
      {
        user,
        isAuthChecked: true,
        isLoading: true,
        error: null,
      },
      updateUser.fulfilled(updatedUser, 'requestId', updateUserRequest)
    );

    expect(result.user).toEqual(updatedUser);
    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает updateUser.rejected', (): void => {
    const result = reducer(
      undefined,
      updateUser.rejected(new Error('Ошибка обновления'), 'requestId', updateUserRequest)
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка обновления');
  });

  it('обрабатывает logoutUser.pending', (): void => {
    const result = reducer(undefined, logoutUser.pending('requestId', undefined));

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает logoutUser.fulfilled', (): void => {
    const result = reducer(
      {
        user,
        isAuthChecked: true,
        isLoading: true,
        error: 'Ошибка',
      },
      logoutUser.fulfilled(undefined, 'requestId', undefined)
    );

    expect(result.user).toBeNull();
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('обрабатывает logoutUser.rejected', (): void => {
    const result = reducer(
      {
        user,
        isAuthChecked: true,
        isLoading: true,
        error: null,
      },
      logoutUser.rejected(new Error('Ошибка выхода'), 'requestId', undefined)
    );

    expect(result.user).toBeNull();
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка выхода');
  });
});
