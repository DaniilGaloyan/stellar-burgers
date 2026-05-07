import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  selectCurrentOrder,
  getOrderByNumber
} from '../../services/slices/feedSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const currentOrder = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);

  const number = Number(location.pathname.split('/').pop());

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(number));
    }
  }, [dispatch, number]);

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
