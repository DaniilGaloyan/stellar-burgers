import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import type { RootState } from '../rootReducer';

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feeds/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Ошибка загрузки ленты заказов');
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feeds/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const orders = await getOrderByNumberApi(number);
    if (!orders.length) {
      return rejectWithValue('Заказ не найден');
    }
    return orders[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Ошибка при получении заказа');
  }
});

type FeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
};

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  currentOrder: null
};

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось загрузить заказ по номеру';
      });
  }
});

export default feedSlice.reducer;

export const selectFeeds = (state: RootState) => state.feeds.orders;
export const selectFeedTotal = (state: RootState) => state.feeds.total;
export const selectFeedTotalToday = (state: RootState) =>
  state.feeds.totalToday;
export const selectFeedLoading = (state: RootState) => state.feeds.loading;
export const selectCurrentOrder = (state: RootState) =>
  state.feeds.currentOrder;
