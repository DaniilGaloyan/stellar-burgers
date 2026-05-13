import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  selectCurrentOrder,
  getOrderByNumber,
  selectOrderLoading
} from '../../services/slices/feedSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  selectProfileOrderNumbers,
  fetchProfileOrders,
  selectProfileOrdersLoading
} from '../../services/slices/profileOrdersSlice';
import { NotFound404 } from '@pages';

type TOrderInfoProps = {
  showTitle?: boolean;
};

export const OrderInfo: FC<TOrderInfoProps> = ({ showTitle = false }) => {
  const { number: numberParam } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const currentOrder = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);
  const orderLoading = useAppSelector(selectOrderLoading);
  const profileOrderNumbers = useAppSelector(selectProfileOrderNumbers);
  const profileOrdersLoading = useAppSelector(selectProfileOrdersLoading);
  const [orderRequestStarted, setOrderRequestStarted] = useState(false);

  const number = Number(numberParam);
  const numberIsValid =
    typeof numberParam === 'string' && /^\d+$/.test(numberParam);
  const isProfileOrder = location.pathname.includes('/profile/orders/');

  useEffect(() => {
    if (numberIsValid) {
      dispatch(getOrderByNumber(number));
      setOrderRequestStarted(true);
    }
    if (isProfileOrder) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, number, numberIsValid, isProfileOrder]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (!numberIsValid) {
    return <NotFound404 />;
  }

  if (!orderRequestStarted) {
    return <Preloader />;
  }

  if (orderLoading) {
    return <Preloader />;
  }

  if (!currentOrder) {
    return <NotFound404 />;
  }

  if (isProfileOrder && profileOrdersLoading) {
    return <Preloader />;
  }

  if (isProfileOrder && !profileOrderNumbers.includes(number)) {
    return <NotFound404 />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      {showTitle && (
        <h2
          className='text text_type_digits-default'
          style={{ marginBottom: '20px' }}
        >
          #{orderInfo.number}
        </h2>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};

export default OrderInfo;
