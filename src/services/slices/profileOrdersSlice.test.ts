import { describe, test, expect } from '@jest/globals';
import profileOrdersReducer, { fetchProfileOrders } from './profileOrdersSlice';
import type { TOrder } from '@utils-types';

describe('profileOrdersSlice reducer', () => {
  const initialState = {
    orders: [] as TOrder[],
    loading: false,
    error: null as string | null
  };

  const order: TOrder = {
    _id: 'profile-order-1',
    status: 'done',
    name: 'Заказ пользователя',
    createdAt: '2026-05-16T00:00:00.000Z',
    updatedAt: '2026-05-16T00:00:00.000Z',
    number: 123,
    ingredients: []
  };

  test('показывает загрузку при fetchProfileOrders.pending', () => {
    const state = profileOrdersReducer(initialState, {
      type: fetchProfileOrders.pending.type
    });

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('сохраняет заказы после fetchProfileOrders.fulfilled', () => {
    const state = profileOrdersReducer(initialState, {
      type: fetchProfileOrders.fulfilled.type,
      payload: [order]
    });

    expect(state).toEqual({
      ...initialState,
      loading: false,
      orders: [order]
    });
  });

  test('сохраняет ошибку после fetchProfileOrders.rejected', () => {
    const state = profileOrdersReducer(initialState, {
      type: fetchProfileOrders.rejected.type,
      payload: 'Ошибка загрузки заказов'
    });

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка загрузки заказов'
    });
  });
});
