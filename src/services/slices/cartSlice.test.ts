import { describe, test, expect } from '@jest/globals';
import cartReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './cartSlice';
import type { TIngredient } from '@utils-types';

describe('cartSlice reducer', () => {
  const initialState = { bun: null, ingredients: [] };

  const bunSample: TIngredient = {
    _id: 'bun-1',
    name: 'Тест булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 20,
    image: 'bun.png',
    image_mobile: 'bun.png',
    image_large: 'bun.png'
  };

  const ingredientSample: TIngredient = {
    _id: 'ing-1',
    name: 'Тест начинка',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 30,
    image: 'ingredient.png',
    image_mobile: 'ingredient.png',
    image_large: 'ingredient.png'
  };

  test('добавляет булку в конструктор', () => {
    const state = cartReducer(initialState, addIngredient(bunSample));

    expect(state).toEqual({ bun: bunSample, ingredients: [] });
  });

  test('добавляет начинку в конструктор', () => {
    const state = cartReducer(initialState, addIngredient(ingredientSample));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      _id: ingredientSample._id,
      name: ingredientSample.name,
      type: ingredientSample.type,
      price: ingredientSample.price
    });
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('удаляет ингредиент из конструктора по id', () => {
    const baseState: ReturnType<typeof cartReducer> = {
      bun: null,
      ingredients: [{ ...ingredientSample, id: 'to-remove' }]
    };

    const state = cartReducer(baseState, removeIngredient('to-remove'));

    expect(state.ingredients).toHaveLength(0);
  });

  test('меняет порядок ингредиентов в конструкторе', () => {
    const baseState: ReturnType<typeof cartReducer> = {
      bun: null,
      ingredients: [
        { ...ingredientSample, id: 'a' },
        { ...ingredientSample, id: 'b' }
      ]
    };

    const state = cartReducer(
      baseState,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(state.ingredients[0].id).toBe('b');
    expect(state.ingredients[1].id).toBe('a');
  });
});
