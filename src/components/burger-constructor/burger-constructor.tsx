import { FC, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectConstructorItems,
  createOrder,
  resetConstructor
} from '../../services/slices/cartSlice';
import { selectUser } from '../../services/slices/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useAppSelector(selectConstructorItems);
  const user = useAppSelector(selectUser);

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const onOrderClick = () => {
    if (!user) {
      localStorage.setItem('pendingOrder', 'true');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    // Создаем массив ID ингредиентов
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    if (ingredientIds.length === 0) return;

    setOrderRequest(true);

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((data) => {
        if (data) {
          const order: TOrder = {
            ...data,
            ingredients: ingredientIds
          };
          setOrderModalData(order);
        }
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      })
      .finally(() => {
        setOrderRequest(false);
      });
  };

  const closeOrderModal = () => {
    if (orderModalData) {
      dispatch(resetConstructor());
    }
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
