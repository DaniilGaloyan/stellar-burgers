import { describe, test, expect } from '@jest/globals';
import authReducer, { login } from './authSlice';
import type { TUser } from '@utils-types';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    error: null
  };

  const user: TUser = {
    _id: 'user-1',
    email: 'test@example.com',
    name: 'Тест Пользователь'
  };

  test('обнуляет ошибку при запуске login', () => {
    const state = authReducer(initialState, { type: login.pending.type });

    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      error: null
    });
  });

  test('устанавливает пользователя после login.fulfilled', () => {
    const state = authReducer(initialState, {
      type: login.fulfilled.type,
      payload: user
    });

    expect(state).toEqual({
      user,
      isAuthChecked: true,
      error: null
    });
  });

  test('записывает ошибку после login.rejected', () => {
    const state = authReducer(initialState, {
      type: login.rejected.type,
      payload: 'Ошибка авторизации',
      error: { message: 'Ошибка авторизации' }
    });

    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      error: 'Ошибка авторизации'
    });
  });
});
