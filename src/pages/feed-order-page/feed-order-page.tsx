import { FC } from 'react';
import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectFeedLoading } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';
import styles from './feed-order-page.module.css';

export const FeedOrderPage: FC = () => {
  const { number } = useParams<{ number: string }>();
  const loading = useAppSelector(selectFeedLoading);

  return (
    <div className={styles.container}>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <h2
            className='text text_type_digits-default'
            style={{ marginBottom: '20px' }}
          >
            #{number}
          </h2>
          <OrderInfo />
        </>
      )}
    </div>
  );
};

export default FeedOrderPage;
