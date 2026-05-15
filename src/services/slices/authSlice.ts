import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface IAuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: IAuthState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const register = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      return response.user;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Ошибка при регистрации');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Ошибка при обновлении профиля');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обработка входа
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      // Обработка проверки аутентификации
      .addCase(checkAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      // Обработка выхода
      .addCase(logout.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
      })

      // Обработка обновления профиля
      .addCase(updateProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { reducer: authReducer } = authSlice;
export const selectUser = (state: { auth: IAuthState }) => state.auth.user;
export const selectIsAuthChecked = (state: { auth: IAuthState }) =>
  state.auth.isAuthChecked;
export default authReducer;
