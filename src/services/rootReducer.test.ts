import { describe, test, expect } from '@jest/globals';
import { rootReducer } from './rootReducer';
import ingredientsReducer from './slices/ingredientsSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

describe('rootReducer', () => {
  test('возвращает корректное начальное состояние при инициализации', () => {
    const initAction = { type: '@@INIT' } as const;
    const initialState = rootReducer(undefined, initAction);

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      cart: cartReducer(undefined, initAction),
      auth: authReducer(undefined, initAction),
      feeds: feedReducer(undefined, initAction),
      profileOrders: profileOrdersReducer(undefined, initAction)
    });
  });

  test('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const fakeAction = { type: 'UNKNOWN_ACTION' } as const;
    const initialState = rootReducer(undefined, fakeAction);

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, fakeAction),
      cart: cartReducer(undefined, fakeAction),
      auth: authReducer(undefined, fakeAction),
      feeds: feedReducer(undefined, fakeAction),
      profileOrders: profileOrdersReducer(undefined, fakeAction)
    });
  });
});
