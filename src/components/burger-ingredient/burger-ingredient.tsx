import { FC, memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI, Preloader } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { burgerConstructorAdd } from '../../services/slices/BurgerConstructorSlice';
import {
  getIngredientsAction,
  getIsIngredientsLoading
} from '../../services/slices/IngredientsSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(burgerConstructorAdd(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
