import { describe, expect, it } from 'vitest';

import { forgotPassword, resetPassword } from './actions';
import { clearPasswordError, passwordSlice } from './slice';

import type { TForgotPasswordRequest, TResetPasswordRequest } from '@utils/types';

const reducer = passwordSlice.reducer;

const forgotPasswordRequest: TForgotPasswordRequest = {
  email: 'user@example.com',
};

const resetPasswordRequest: TResetPasswordRequest = {
  password: 'new-password',
  token: 'reset-token',
};

describe('passwordSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      isLoading: false,
      error: null,
    });
  });

  it('очищает ошибку восстановления пароля', (): void => {
    const result = reducer(
      {
        isLoading: false,
        error: 'Ошибка',
      },
      clearPasswordError()
    );

    expect(result.error).toBeNull();
  });

  it('обрабатывает forgotPassword.pending', (): void => {
    const result = reducer(
      undefined,
      forgotPassword.pending('requestId', forgotPasswordRequest)
    );

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает forgotPassword.fulfilled', (): void => {
    const result = reducer(
      {
        isLoading: true,
        error: null,
      },
      forgotPassword.fulfilled({ success: true }, 'requestId', forgotPasswordRequest)
    );

    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает forgotPassword.rejected', (): void => {
    const result = reducer(
      undefined,
      forgotPassword.rejected(
        new Error('Ошибка отправки'),
        'requestId',
        forgotPasswordRequest
      )
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка отправки');
  });

  it('обрабатывает resetPassword.pending', (): void => {
    const result = reducer(
      undefined,
      resetPassword.pending('requestId', resetPasswordRequest)
    );

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает resetPassword.fulfilled', (): void => {
    const result = reducer(
      {
        isLoading: true,
        error: null,
      },
      resetPassword.fulfilled({ success: true }, 'requestId', resetPasswordRequest)
    );

    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает resetPassword.rejected', (): void => {
    const result = reducer(
      undefined,
      resetPassword.rejected(
        new Error('Ошибка сохранения'),
        'requestId',
        resetPasswordRequest
      )
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка сохранения');
  });
});
