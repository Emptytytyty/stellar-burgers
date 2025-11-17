import { configureStore } from '@reduxjs/toolkit';
import { expect, test } from '@jest/globals';
import { RootReducer } from './RootReducer';

test('Проверка инициализации rootReducer', () => {
  const store = configureStore({
    reducer: RootReducer
  });
  const state = store.getState();
  expect(state).toEqual({
    ingredients: {
      ingredients: [],
      isLoading: false,
      isError: false,
      error: null
    },
    burgerConstructor: { items: { bun: null, ingredients: [] } },
    user: {
      user: null,
      isAuthChecked: true,
      isAuthenticated: false,
      loginUserError: null,
      loginUserRequest: false,
      logoutUserRequest: false,
      logoutUserError: null,
      updateUserRequest: false,
      updateUserError: null
    },
    orders: {
      ordersData: null,
      userOrders: [],
      isOrdersRequest: false,
      ordersError: null,
      isUserOrdersRequest: false,
      userOrdersError: null,
      postOrderRequest: false,
      postOrderError: null,
      orderModalData: null,
      orderByNumberRequest: false,
      orderByNumberError: null
    }
  });
});
