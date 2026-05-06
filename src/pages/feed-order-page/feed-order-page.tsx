import { FC } from 'react';
import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';
import styles from './feed-order-page.module.css';

export const FeedOrderPage: FC = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={styles.container}>
      <p className='text text_type_digits-default'>#{number}</p>
      <OrderInfo />
    </div>
  );
};

export default FeedOrderPage;
