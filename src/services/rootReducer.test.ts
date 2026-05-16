import { describe, test, expect } from '@jest/globals';
import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  test('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      cart: {
        bun: null,
        ingredients: []
      },
      auth: {
        user: null,
        isAuthChecked: false,
        error: null
      },
      feeds: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        orderLoading: false,
        error: null,
        currentOrder: null
      },
      profileOrders: {
        orders: [],
        loading: false,
        error: null
      }
    });
  });
});
