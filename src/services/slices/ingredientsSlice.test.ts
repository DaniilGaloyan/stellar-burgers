import { describe, test, expect } from '@jest/globals';
import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import type { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    items: [] as TIngredient[],
    loading: false,
    error: null as string | null
  };

  test('показывает загрузку при fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state).toEqual({
      items: [],
      loading: true,
      error: null
    });
  });

  test('сохраняет ингредиенты при fetchIngredients.fulfilled', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'Тест-ингредиент',
        type: 'main',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 100,
        price: 100,
        image: 'image.png',
        image_mobile: 'image.png',
        image_large: 'image.png'
      }
    ];

    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload
    });

    expect(state).toEqual({
      items: payload,
      loading: false,
      error: null
    });
  });

  test('сохраняет ошибку при fetchIngredients.rejected', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки ингредиентов' }
    });

    expect(state).toEqual({
      items: [],
      loading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
