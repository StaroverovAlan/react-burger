import { API_URL } from './constants';

import type { TIngredientsResponse, TOrderResponse } from './types';

const checkResponse = <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  return Promise.reject(new Error(`Ошибка запроса: ${response.status}`));
};

const checkSuccess = <T extends { success: boolean }>(data: T): T => {
  if (data.success) {
    return data;
  }

  throw new Error('Ответ API содержит success: false');
};

const request = <T extends { success: boolean }>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  return fetch(`${API_URL}${endpoint}`, options)
    .then(checkResponse<T>)
    .then(checkSuccess);
};

export const getIngredientsApi = (): Promise<TIngredientsResponse> => {
  return request<TIngredientsResponse>('/ingredients');
};

export const createOrderApi = (ingredients: string[]): Promise<TOrderResponse> => {
  return request<TOrderResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
};
