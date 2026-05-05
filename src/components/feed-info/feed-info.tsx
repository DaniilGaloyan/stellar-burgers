import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import {
  selectFeeds,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/slices/feedSlice';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useAppSelector(selectFeeds);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
