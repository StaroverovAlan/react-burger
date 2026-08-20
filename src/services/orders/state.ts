import type { TOrder } from '@utils/types';

export type TOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
};

export const createInitialOrdersState = (): TOrdersState => ({
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  isLoading: false,
  error: null,
});
