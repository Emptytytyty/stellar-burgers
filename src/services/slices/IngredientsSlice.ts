import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  isError: boolean;
  error: null | string;
};

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  isError: false,
  error: null
};

export const getIngredientsAction = createAsyncThunk<TIngredient[]>(
  'ingredients/get',
  getIngredientsApi
);

export const IngredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  reducers: {},
  selectors: {
    getIngredients: (state: IngredientsState) => state.ingredients,
    getIsIngredientsLoading: (state: IngredientsState) => state.isLoading,
    getIsIngredientsError: (state: IngredientsState) => state.isError,
    getIngredientById: (state: IngredientsState, id: string) =>
      state.ingredients.find((ingregient) => ingregient._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsAction.pending, (state: IngredientsState) => {
        state.isLoading = true;
      })
      .addCase(
        getIngredientsAction.rejected,
        (state: IngredientsState, action) => {
          state.isLoading = false;
          state.isError = true;
          state.error = action.error.message!;
        }
      )
      .addCase(
        getIngredientsAction.fulfilled,
        (state: IngredientsState, action) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      );
  }
});

export const {
  getIngredients,
  getIsIngredientsError,
  getIsIngredientsLoading,
  getIngredientById
} = IngredientsSlice.selectors;
