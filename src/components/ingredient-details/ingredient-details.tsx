import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredientById,
  getIngredientsAction
} from '../../services/slices/IngredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const params = useParams();
  const ingredientData = useSelector((state) =>
    getIngredientById(state, params.id!)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ingredientData) dispatch(getIngredientsAction());
  }, [ingredientData]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
