import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { IngredientDetails } from '@components';
import { NotFound404 } from '@pages';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);

  if (
    id &&
    ingredients.length &&
    !ingredients.find((item) => item._id === id)
  ) {
    return <NotFound404 />;
  }

  return (
    <div className={styles.container}>
      <h2 className='text text_type_main-large'>Детали ингредиента</h2>
      <IngredientDetails />
    </div>
  );
};

export default IngredientPage;
