import { describe, expect, it } from 'vitest';

import {
  profileOrdersClose,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersError,
  profileOrdersMessage,
  profileOrdersOpen,
  profileOrdersSlice,
} from './slice';

import type { TOrder, TOrdersResponse } from '@utils/types';

const reducer = profileOrdersSlice.reducer;

const order: TOrder = {
  ingredients: ['bun-id', 'main-id', 'bun-id'],
  _id: 'order-id',
  status: 'pending',
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

describe('profileOrdersSlice', () => {
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

  it('обрабатывает profileOrdersConnect и очищает старые заказы', (): void => {
    const result = reducer(
      {
        orders: [order],
        total: 10,
        totalToday: 2,
        isConnected: true,
        isLoading: false,
        error: 'Ошибка',
      },
      profileOrdersConnect()
    );

    expect(result.orders).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalToday).toBe(0);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('обрабатывает profileOrdersDisconnect и очищает список', (): void => {
    const result = reducer(
      {
        orders: [order],
        total: 10,
        totalToday: 2,
        isConnected: true,
        isLoading: true,
        error: null,
      },
      profileOrdersDisconnect()
    );

    expect(result.orders).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalToday).toBe(0);
    expect(result.isConnected).toBe(false);
    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает profileOrdersOpen', (): void => {
    const result = reducer(undefined, profileOrdersOpen());

    expect(result.isConnected).toBe(true);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('обрабатывает profileOrdersMessage', (): void => {
    const result = reducer(undefined, profileOrdersMessage(ordersResponse));

    expect(result.orders).toEqual([order]);
    expect(result.total).toBe(10);
    expect(result.totalToday).toBe(2);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('обрабатывает profileOrdersError', (): void => {
    const result = reducer(undefined, profileOrdersError('Ошибка сокета'));

    expect(result.error).toBe('Ошибка сокета');
    expect(result.isLoading).toBe(false);
  });

  it('обрабатывает profileOrdersClose', (): void => {
    const result = reducer(
      {
        orders: [order],
        total: 10,
        totalToday: 2,
        isConnected: true,
        isLoading: true,
        error: null,
      },
      profileOrdersClose()
    );

    expect(result.isConnected).toBe(false);
    expect(result.isLoading).toBe(false);
  });
});
