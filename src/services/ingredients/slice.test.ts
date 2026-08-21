import { describe, expect, it } from 'vitest';

import { ingredients as mockIngredients } from '@utils/ingredients';

import { fetchIngredients } from './actions';
import { ingredientsSlice } from './slice';

const reducer = ingredientsSlice.reducer;

describe('ingredientsSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает fetchIngredients.pending', (): void => {
    const result = reducer(undefined, fetchIngredients.pending('requestId', undefined));

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает fetchIngredients.fulfilled', (): void => {
    const result = reducer(
      undefined,
      fetchIngredients.fulfilled(
        {
          success: true,
          data: mockIngredients,
        },
        'requestId',
        undefined
      )
    );

    expect(result.isLoading).toBe(false);
    expect(result.items).toEqual(mockIngredients);
  });

  it('обрабатывает fetchIngredients.rejected', (): void => {
    const result = reducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка загрузки'), 'requestId', undefined)
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки');
  });
});
