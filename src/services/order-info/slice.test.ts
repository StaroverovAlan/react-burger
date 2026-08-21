import { describe, expect, it } from 'vitest';

import { fetchOrderByNumber } from './actions';
import { clearOrderInfo, orderInfoSlice } from './slice';

import type { TOrder } from '@utils/types';

const reducer = orderInfoSlice.reducer;

const order: TOrder = {
  ingredients: ['bun-id', 'main-id', 'bun-id'],
  _id: 'order-id',
  status: 'done',
  number: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  name: 'Космический бургер',
};

describe('orderInfoSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      order: null,
      isLoading: false,
      error: null,
    });
  });

  it('очищает информацию о заказе', (): void => {
    const result = reducer(
      {
        order,
        isLoading: true,
        error: 'Ошибка',
      },
      clearOrderInfo()
    );

    expect(result).toEqual({
      order: null,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает fetchOrderByNumber.pending', (): void => {
    const result = reducer(undefined, fetchOrderByNumber.pending('requestId', '1'));

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает fetchOrderByNumber.fulfilled', (): void => {
    const result = reducer(
      undefined,
      fetchOrderByNumber.fulfilled(
        {
          success: true,
          orders: [order],
        },
        'requestId',
        '1'
      )
    );

    expect(result.isLoading).toBe(false);
    expect(result.order).toEqual(order);
  });

  it('записывает null, если заказ не найден в успешном ответе', (): void => {
    const result = reducer(
      {
        order,
        isLoading: true,
        error: null,
      },
      fetchOrderByNumber.fulfilled(
        {
          success: true,
          orders: [],
        },
        'requestId',
        '1'
      )
    );

    expect(result.order).toBeNull();
    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает fetchOrderByNumber.rejected', (): void => {
    const result = reducer(
      undefined,
      fetchOrderByNumber.rejected(new Error('Ошибка заказа'), 'requestId', '1')
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка заказа');
  });
});
