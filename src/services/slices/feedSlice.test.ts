import { describe, test, expect } from '@jest/globals';
import feedReducer, { fetchFeeds, getOrderByNumber } from './feedSlice';
import type { TOrder } from '@utils-types';

describe('feedSlice reducer', () => {
  const initialState = {
    orders: [] as TOrder[],
    total: 0,
    totalToday: 0,
    loading: false,
    orderLoading: false,
    error: null as string | null,
    currentOrder: null as TOrder | null
  };

  const order: TOrder = {
    _id: 'order-1',
    status: 'done',
    name: 'Тестовый заказ',
    createdAt: '2026-05-16T00:00:00.000Z',
    updatedAt: '2026-05-16T00:00:00.000Z',
    number: 1,
    ingredients: []
  };

  test('показывает загрузку при fetchFeeds.pending', () => {
    const state = feedReducer(initialState, { type: fetchFeeds.pending.type });

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  test('сохраняет данные после fetchFeeds.fulfilled', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.fulfilled.type,
      payload: { orders: [order], total: 1, totalToday: 1 }
    });

    expect(state).toEqual({
      ...initialState,
      loading: false,
      orders: [order],
      total: 1,
      totalToday: 1
    });
  });

  test('сохраняет ошибку после fetchFeeds.rejected', () => {
    const state = feedReducer(initialState, {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка загрузки ленты заказов' }
    });

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка загрузки ленты заказов'
    });
  });

  test('переходит в состояние ожидания при getOrderByNumber.pending', () => {
    const state = feedReducer(initialState, {
      type: getOrderByNumber.pending.type
    });

    expect(state).toEqual({
      ...initialState,
      orderLoading: true,
      error: null,
      currentOrder: null
    });
  });

  test('сохраняет заказ после getOrderByNumber.fulfilled', () => {
    const state = feedReducer(initialState, {
      type: getOrderByNumber.fulfilled.type,
      payload: order
    });

    expect(state).toEqual({
      ...initialState,
      orderLoading: false,
      currentOrder: order
    });
  });

  test('сохраняет ошибку после getOrderByNumber.rejected', () => {
    const state = feedReducer(initialState, {
      type: getOrderByNumber.rejected.type,
      payload: 'Не удалось загрузить заказ по номеру'
    });

    expect(state).toEqual({
      ...initialState,
      orderLoading: false,
      error: 'Не удалось загрузить заказ по номеру'
    });
  });
});
