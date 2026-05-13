import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

type TErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
};

type TServerResponse<T> = {
  success: boolean;
} & T;

type TResponse<T> = TServerResponse<T> | TErrorResponse;

const checkResponse = <T>(res: Response): Promise<TResponse<T>> =>
  res.ok
    ? res.json()
    : res
        .json()
        .then((err) => Promise.reject({ ...err, statusCode: res.status }));

async function request<T>(
  endpoint: string,
  options: RequestInit
): Promise<TResponse<T>> {
  try {
    const res = await fetch(`${URL}/${endpoint}`, {
      headers: {
        'content-type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return await checkResponse<T>(res);
  } catch (error) {
    console.error('Ошибка сети:', error);
    return Promise.reject(error);
  }
}

type TRefreshResponse = TServerResponse<{
  success: boolean;
  refreshToken: string;
  accessToken: string;
}>;

function refreshToken(): Promise<TResponse<TRefreshResponse>> {
  return request('auth/token', {
    method: 'POST',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });
}

export async function fetchWithRefresh<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  try {
    const token = getCookie('accessToken');
    if (!token) {
      console.log('Токен отсутствует в куках');
    }

    const response = await request<T>(endpoint, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...options.headers
      }
    });

    if ('success' in response && response.success) {
      return response as unknown as T;
    }

    return Promise.reject(response);
  } catch (error: any) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      const refreshData = await refreshToken();

      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }

      setCookie('accessToken', refreshData.accessToken);
      localStorage.setItem('refreshToken', refreshData.refreshToken);

      const updatedOptions = {
        ...options,
        headers: {
          'content-type': 'application/json',
          ...options.headers,
          authorization: refreshData.accessToken
        }
      };

      const response = await request<T>(endpoint, updatedOptions);

      if ('success' in response && response.success) {
        return response as unknown as T;
      }

      return Promise.reject(response);
    }

    return Promise.reject(error);
  }
}

type TIngredientsResponse = TServerResponse<{
  success: boolean;
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = () =>
  request<TIngredientsResponse>('ingredients', {
    method: 'GET'
  }).then((data) => {
    if ('success' in data && data.success) return data.data;
    return Promise.reject(data);
  });

export const getFeedsApi = () =>
  request<TFeedsResponse>('orders/all', {
    method: 'GET'
  }).then((data) => {
    if ('success' in data && data.success) return data;
    return Promise.reject(data);
  });

export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>('orders', {
    method: 'GET',
    headers: {
      authorization: getCookie('accessToken') || ''
    }
  }).then((data) => {
    if ('success' in data && data.success) return data.orders;
    return Promise.reject(data);
  });

type TOwner = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  owner: TOwner;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

type TNewOrderResponse = TServerResponse<{
  success: boolean;
  order: TNewOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>('orders', {
    method: 'POST',
    headers: {
      authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if ('success' in data && data.success) return data;

    console.error('Ошибка создания заказа:', data);
    return Promise.reject(data);
  });

type TOrderResponse = TServerResponse<{
  success: boolean;
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  request<TOrderResponse>(`orders/${number}`, {
    method: 'GET'
  }).then((data) => {
    if ('success' in data && data.success) return data.orders;
    return Promise.reject(data);
  });

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  success: boolean;
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  request<TAuthResponse>('auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((data) => {
    if ('success' in data && data.success) return data;
    return Promise.reject(data);
  });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  request<TAuthResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((data) => {
    if ('success' in data && data.success) return data;
    return Promise.reject(data);
  });

export const forgotPasswordApi = (data: { email: string }) =>
  request('password-reset', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((data) => {
    if ('success' in data && data.success) return data;
    return Promise.reject(data);
  });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request('password-reset/reset', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((data) => {
    if ('success' in data && data.success) return data;
    return Promise.reject(data);
  });

type TUserResponse = TServerResponse<{
  success: boolean;
  user: TUser;
}>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    headers: {
      authorization: getCookie('accessToken') || ''
    }
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  request('auth/logout', {
    method: 'POST',
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((data) => {
    if ('success' in data && data.success) return data;
    return Promise.reject(data);
  });
