import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => (
  <div className={`${styles.content}`}>
    {orderByDate.length > 0 ? (
      orderByDate.map((order) => <OrderCard order={order} key={order._id} />)
    ) : (
      <p className='text text_type_main-default'>Заказы не найдены</p>
    )}
  </div>
);
