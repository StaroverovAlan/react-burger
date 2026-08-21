import { describe, expect, it } from 'vitest';

import {
  feedClose,
  feedConnect,
  feedDisconnect,
  feedError,
  feedMessage,
  feedOpen,
  feedSlice,
} from './slice';

import type { TOrder, TOrdersResponse } from '@utils/types';

const reducer = feedSlice.reducer;

const order: TOrder = {
  ingredients: ['bun-id', 'main-id', 'bun-id'],
  _id: 'order-id',
  status: 'done',
  number: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  name: 'Космический бургер',
};

const ordersResponse: TOrdersResponse = {
  success: true,
  orders: [order],
  total: 10,
  totalToday: 2,
};

describe('feedSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isConnected: false,
      isLoading: false,
      error: null,
    });
  });

  it('обрабатывает feedConnect', (): void => {
    const result = reducer(undefined, feedConnect());

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает feedDisconnect', (): void => {
    const result = reducer(
      {
        orders: [order],
        total: 10,
        totalToday: 2,
        isConnected: true,
        isLoading: true,
        error: null,
      },
      feedDisconnect()
    );

    expect(result.isConnected).toBe(false);
    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает feedOpen', (): void => {
    const result = reducer(undefined, feedOpen());

    expect(result.isConnected).toBe(true);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('обрабатывает feedMessage', (): void => {
    const result = reducer(undefined, feedMessage(ordersResponse));

    expect(result.orders).toEqual([order]);
    expect(result.total).toBe(10);
    expect(result.totalToday).toBe(2);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('обрабатывает feedError', (): void => {
    const result = reducer(undefined, feedError('Ошибка сокета'));

    expect(result.error).toBe('Ошибка сокета');
    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает feedClose', (): void => {
    const result = reducer(
      {
        orders: [order],
        total: 10,
        totalToday: 2,
        isConnected: true,
        isLoading: true,
        error: null,
      },
      feedClose()
    );

    expect(result.isConnected).toBe(false);
    expect(result.isLoading).toBe(false);
  });
});
