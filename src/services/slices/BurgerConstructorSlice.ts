import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type BurgerConstructorState = {
  items: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: BurgerConstructorState = {
  items: {
    bun: null,
    ingredients: []
  }
};

const setIngredientsIndex = (item: TConstructorIngredient, i: number) => ({
  ...item,
  id: `${i}`
});

export const BurgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    burgerConstructorAdd: (state: BurgerConstructorState, action) => {
      if (action.payload.type === 'bun') state.items.bun = action.payload;
      else {
        const id = `${state.items.ingredients.length}`;
        state.items.ingredients = [
          ...state.items.ingredients,
          { ...action.payload, id }
        ];
      }
    },
    burgerConstructorRemove: (state: BurgerConstructorState, action) => {
      if (action.payload.type !== 'bun')
        state.items.ingredients = state.items.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
      state.items.ingredients =
        state.items.ingredients.map(setIngredientsIndex);
    },
    burgerConstructorClear: (state: BurgerConstructorState) => {
      state.items.bun = null;
      state.items.ingredients = [];
    },
    burgerConstructorMove: (
      state: BurgerConstructorState,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const ingredients = state.items.ingredients.map((item) => item);
      const { from, to } = action.payload;
      const itemMoved = ingredients.splice(from, 1);
      ingredients.splice(to, 0, ...itemMoved);
      state.items.ingredients = ingredients.map(setIngredientsIndex);
    }
  },
  selectors: {
    getBurgerConstructorIngredients: (state: BurgerConstructorState) =>
      state.items,
    getConstructorOrderData: (state: BurgerConstructorState) => [
      state.items.bun?._id,
      ...state.items.ingredients.map((ing) => ing._id)
    ]
  }
});

export const {
  burgerConstructorAdd,
  burgerConstructorRemove,
  burgerConstructorClear,
  burgerConstructorMove
} = BurgerConstructorSlice.actions;
export const { getBurgerConstructorIngredients, getConstructorOrderData } =
  BurgerConstructorSlice.selectors;
