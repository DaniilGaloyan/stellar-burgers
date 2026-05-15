import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersLoading
} from '../../services/slices/profileOrdersSlice';
import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders/profile-orders';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useSelector(selectProfileOrders);
  const loading = useSelector(selectProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
