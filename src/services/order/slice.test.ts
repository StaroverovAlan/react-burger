import { describe, expect, it } from 'vitest';

import { createOrder } from './actions';
import { clearOrder, orderSlice } from './slice';

const reducer = orderSlice.reducer;
const ingredientIds = ['bun-id', 'main-id', 'bun-id'];

describe('orderSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      orderNumber: null,
      isLoading: false,
      error: null,
    });
  });

  it('очищает номер заказа и ошибку', (): void => {
    const result = reducer(
      {
        orderNumber: 123,
        isLoading: false,
        error: 'Ошибка',
      },
      clearOrder()
    );

    expect(result).toEqual({
      orderNumber: null,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает createOrder.pending', (): void => {
    const result = reducer(undefined, createOrder.pending('requestId', ingredientIds));

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает createOrder.fulfilled', (): void => {
    const result = reducer(
      undefined,
      createOrder.fulfilled(
        {
          success: true,
          name: 'Космический бургер',
          order: { number: 777 },
        },
        'requestId',
        ingredientIds
      )
    );

    expect(result.isLoading).toBe(false);
    expect(result.orderNumber).toBe(777);
  });

  it('обрабатывает createOrder.rejected', (): void => {
    const result = reducer(
      undefined,
      createOrder.rejected(new Error('Ошибка заказа'), 'requestId', ingredientIds)
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка заказа');
  });
});
