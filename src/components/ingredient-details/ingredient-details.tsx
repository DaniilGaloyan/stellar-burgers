import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { NotFound404 } from '@pages';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    if (ingredients.length) {
      return <NotFound404 />;
    }
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
