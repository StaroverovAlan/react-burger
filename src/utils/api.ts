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

export const getIngredientsApi = (): Promise<TIngredientsResponse> => {
  return fetch(`${API_URL}/ingredients`)
    .then(checkResponse<TIngredientsResponse>)
    .then(checkSuccess);
};

export const createOrderApi = (ingredients: string[]): Promise<TOrderResponse> => {
  return fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  })
    .then(checkResponse<TOrderResponse>)
    .then(checkSuccess);
};
