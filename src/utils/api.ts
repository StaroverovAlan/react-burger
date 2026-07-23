import { API_URL } from './constants';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './tokens';

import type {
  TAuthResponse,
  TDefaultResponse,
  TForgotPasswordRequest,
  TIngredientsResponse,
  TLoginRequest,
  TOrderResponse,
  TRefreshTokenResponse,
  TRegisterRequest,
  TResetPasswordRequest,
  TUpdateUserRequest,
  TUserResponse,
} from './types';

type TServerErrorResponse = {
  success?: boolean;
  message?: string;
};

export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

const getResponseData = async <T>(response: Response): Promise<T> => {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
};

const checkResponse = async <T>(response: Response): Promise<T> => {
  const data = await getResponseData<T & TServerErrorResponse>(response);

  if (response.ok) {
    return data;
  }

  throw new ServerError(
    data.message ?? `Ошибка запроса: ${response.status}`,
    response.status
  );
};

const checkSuccess = <T extends { success: boolean }>(data: T): T => {
  if (data.success) {
    return data;
  }

  throw new ServerError('Ответ API содержит success: false', 400);
};

const request = <T extends { success: boolean }>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  return fetch(`${API_URL}${endpoint}`, options)
    .then(checkResponse<T>)
    .then(checkSuccess);
};

const refreshTokenApi = (): Promise<TRefreshTokenResponse> => {
  return request<TRefreshTokenResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
};

const isAuthError = (error: unknown): boolean => {
  return (
    error instanceof ServerError &&
    (error.statusCode === 401 ||
      error.message === 'jwt expired' ||
      (error.statusCode === 403 && Boolean(getRefreshToken())))
  );
};

export const fetchWithRefresh = async <T extends { success: boolean }>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (error) {
    if (!isAuthError(error)) {
      throw error;
    }

    const refreshData = await refreshTokenApi();

    setAccessToken(refreshData.accessToken);
    setRefreshToken(refreshData.refreshToken);

    return request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: refreshData.accessToken,
      },
    });
  }
};

export const getIngredientsApi = (): Promise<TIngredientsResponse> => {
  return request<TIngredientsResponse>('/ingredients');
};

export const createOrderApi = (ingredients: string[]): Promise<TOrderResponse> => {
  return fetchWithRefresh<TOrderResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAccessToken() ?? '',
    },
    body: JSON.stringify({ ingredients }),
  });
};

export const registerApi = (data: TRegisterRequest): Promise<TAuthResponse> => {
  return request<TAuthResponse>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const loginApi = (data: TLoginRequest): Promise<TAuthResponse> => {
  return request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const logoutApi = (): Promise<TDefaultResponse> => {
  return request<TDefaultResponse>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
};

export const getUserApi = (): Promise<TUserResponse> => {
  return fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'GET',
    headers: {
      Authorization: getAccessToken() ?? '',
    },
  });
};

export const updateUserApi = (data: TUpdateUserRequest): Promise<TUserResponse> => {
  return fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAccessToken() ?? '',
    },
    body: JSON.stringify(data),
  });
};

export const forgotPasswordApi = (
  data: TForgotPasswordRequest
): Promise<TDefaultResponse> => {
  return request<TDefaultResponse>('/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const resetPasswordApi = (
  data: TResetPasswordRequest
): Promise<TDefaultResponse> => {
  return request<TDefaultResponse>('/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const saveAuthTokens = (response: TAuthResponse): void => {
  setAccessToken(response.accessToken);
  setRefreshToken(response.refreshToken);
};

export const clearAuthTokens = (): void => {
  clearTokens();
};
