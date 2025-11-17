import { configureStore } from '@reduxjs/toolkit';
import { expect, test } from '@jest/globals';
import { RootReducer } from './RootReducer';
import { initialState as ingredients } from '../slices/Ingredients/IngredientsSlice';
import { initialState as burgerConstructor } from '../slices/BurgerConstructor/BurgerConstructorSlice';
import { initialState as user } from '../slices/User/UserSlice';
import { initialState as orders } from '../slices/Orders/OrdersSlice';

test('Проверка инициализации rootReducer', () => {
  const store = configureStore({
    reducer: RootReducer
  });
  const state = store.getState();
  expect(state).toEqual({
    ingredients,
    burgerConstructor,
    user,
    orders
  });
});
