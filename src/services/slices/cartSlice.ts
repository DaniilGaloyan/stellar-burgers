import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';
import type { RootState } from '../rootReducer';

type TConstructorIngredient = TIngredient & { id: string };

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const CART_STORAGE_KEY = 'burger-constructor';

const loadCartFromStorage = (): ConstructorState => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        typeof parsed === 'object' &&
        (parsed.bun === null || typeof parsed.bun === 'object') &&
        Array.isArray(parsed.ingredients)
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке корзины из localStorage:', error);
  }

  return {
    bun: null,
    ingredients: []
  };
};

const saveCartToStorage = (state: ConstructorState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Ошибка при сохранении корзины в localStorage:', error);
  }
};

const initialState: ConstructorState = loadCartFromStorage();

export const createOrder = createAsyncThunk(
  'cart/createOrder',
  async (ids: string[], { rejectWithValue }) => {
    try {
      const token = document.cookie.match(/accessToken=([^;]+)/);
      if (!token) {
        return rejectWithValue('Токен авторизации отсутствует');
      }

      if (!ids || ids.length === 0) {
        return rejectWithValue('Необходимо выбрать ингредиенты для заказа');
      }

      const response = await orderBurgerApi(ids);
      return response.order;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Неизвестная ошибка при создании заказа');
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const item = action.payload;
      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.ingredients.push({ ...item, id: Date.now().toString() });
      }
      saveCartToStorage(state);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
      saveCartToStorage(state);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const temp = state.ingredients[dragIndex];
      state.ingredients[dragIndex] = state.ingredients[hoverIndex];
      state.ingredients[hoverIndex] = temp;
      saveCartToStorage(state);
    },
    resetConstructor: () => {
      const emptyState = { bun: null, ingredients: [] };
      saveCartToStorage(emptyState);
      return emptyState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {})
      .addCase(createOrder.fulfilled, (state, action) => {
        const emptyState = { bun: null, ingredients: [] };
        saveCartToStorage(emptyState);
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.error('Ошибка создания заказа:', action.payload);
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = cartSlice.actions;

export const selectConstructorItems = (state: RootState): ConstructorState =>
  state.cart;

export default cartSlice.reducer;
