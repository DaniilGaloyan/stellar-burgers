import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectFeedLoading
} from '../../services/slices/feedSlice';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeeds);
  const loading = useAppSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
