import { API_URL } from './constants';

import type { TIngredientsResponse } from './types';

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
