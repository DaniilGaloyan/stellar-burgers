import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  IngredientDetails,
  OrderInfo,
  ProtectedRoute,
  OnlyUnAuthRoute
} from '@components';
import { Preloader } from '@ui';

import { AppDispatch } from '../../services/store';

import {
  fetchIngredients,
  selectIngredients,
  selectIsLoading,
  selectError
} from '../../services/slices/ingredientsSlice';

import { fetchFeeds } from '../../services/slices/feedSlice';

import {
  checkAuth,
  selectIsAuthChecked
} from '../../services/slices/authSlice';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isIngredientsLoading = useSelector(selectIsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkAuth());
    dispatch(fetchFeeds());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <BrowserRouter>
        <AppHeader />
        {isIngredientsLoading || !isAuthChecked ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : ingredients.length > 0 ? (
          <Routes>
            {/* По роуту - публичные маршруты */}
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            {/* По защищённому роуту - защищённые маршруты OnlyUnAuthRoute */}
            <Route
              path='/login'
              element={
                <OnlyUnAuthRoute>
                  <Login />
                </OnlyUnAuthRoute>
              }
            />
            <Route
              path='/register'
              element={
                <OnlyUnAuthRoute>
                  <Register />
                </OnlyUnAuthRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <OnlyUnAuthRoute>
                  <ForgotPassword />
                </OnlyUnAuthRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <OnlyUnAuthRoute>
                  <ResetPassword />
                </OnlyUnAuthRoute>
              }
            />

            {/* По защищённому роуту - защищённые маршруты ProtectedRoute */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            {/* По роуту - модальные окна */}
            <Route
              path='/ingredients/:id'
              element={
                <Modal
                  title='Детали ингредиента'
                  onClose={() => window.history.back()}
                >
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal
                  title='Информация о заказе'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title='Информация о заказе'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              }
            />

            {/* По роуту - маршрут 404 */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>
        ) : (
          <div className={`${styles.title} text text_type_main-medium pt-4`}>
            Нет игредиентов
          </div>
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;
