import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  cart: cartReducer,
  auth: authReducer,
  feeds: feedReducer,
  profileOrders: profileOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
