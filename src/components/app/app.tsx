import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  IngredientPage,
  FeedOrderPage
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

  const location = useLocation();
  const locationState = location.state as { background?: Location } | null;
  const background = locationState?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthChecked]);

  if (isIngredientsLoading || !isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      </div>
    );
  }

  if (!ingredients.length) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* По роуту - публичные маршруты */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route path='/feed/:number' element={<FeedOrderPage />} />

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
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <FeedOrderPage />
            </ProtectedRoute>
          }
        />

        {/* По роуту - маршрут 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* По роуту - модальные окна, если есть background */}
      {background && (
        <Routes>
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
              <ProtectedRoute>
                <Modal
                  title='Информация о заказе'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
