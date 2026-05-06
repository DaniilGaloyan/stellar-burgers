import { FC } from 'react';
import { IngredientDetails } from '@components';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => (
  <div className={styles.container}>
    <h2 className='text text_type_main-large'>Детали ингредиента</h2>
    <IngredientDetails />
  </div>
);

export default IngredientPage;
