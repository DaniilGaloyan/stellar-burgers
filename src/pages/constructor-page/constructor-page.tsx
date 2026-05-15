import { useAppSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsLoading
} from '../../services/slices/ingredientsSlice';
import { ConstructorPageUI } from '@ui-pages';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIsLoading);

  return (
    <ConstructorPageUI
      isIngredientsLoading={isLoading}
      ingredients={ingredients}
    />
  );
};
