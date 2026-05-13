import { FC } from 'react';
import { OrderInfo } from '@components';
import styles from './feed-order-page.module.css';

export const FeedOrderPage: FC = () => (
  <div className={styles.container}>
    <OrderInfo showTitle />
  </div>
);

export default FeedOrderPage;
