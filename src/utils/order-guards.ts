import type {
  TOrder,
  TOrdersResponse,
  TOrderStatus,
  TWebSocketErrorResponse,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isOrderStatus = (value: unknown): value is TOrderStatus => {
  return value === 'created' || value === 'pending' || value === 'done';
};

export const isOrder = (value: unknown): value is TOrder => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.ingredients) &&
    value.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    typeof value._id === 'string' &&
    isOrderStatus(value.status) &&
    typeof value.number === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    (typeof value.name === 'string' || typeof value.name === 'undefined')
  );
};

export const isOrdersResponse = (value: unknown): value is TOrdersResponse => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.success === 'boolean' &&
    Array.isArray(value.orders) &&
    value.orders.every(isOrder) &&
    typeof value.total === 'number' &&
    typeof value.totalToday === 'number'
  );
};

export const isWebSocketErrorResponse = (
  value: unknown
): value is TWebSocketErrorResponse => {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.message === 'string';
};

export const isInvalidTokenError = (value: unknown): boolean => {
  return isWebSocketErrorResponse(value) && value.message === 'Invalid or missing token';
};
