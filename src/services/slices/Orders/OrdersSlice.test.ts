import { describe, jest, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  getFeeds,
  getOrderByNumber,
  getUserOrders,
  orderModalDataClear,
  OrdersSlice,
  postOrder
} from './OrdersSlice';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

const mockedOrders = {
  success: true,
  orders: [
    {
      _id: '69191299a64177001b31ed10',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-11-15T23:54:01.050Z',
      updatedAt: '2025-11-15T23:54:01.233Z',
      number: 94295
    },
    {
      _id: '691911b1a64177001b31ed0d',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-11-15T23:50:09.431Z',
      updatedAt: '2025-11-15T23:50:09.657Z',
      number: 94294
    },
    {
      _id: '69190a5ca64177001b31ed00',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-11-15T23:18:52.221Z',
      updatedAt: '2025-11-15T23:18:52.401Z',
      number: 94293
    }
  ],
  total: 3,
  totalToday: 3
};

const newOrderMock = {
  order: {
    _id: '69191299a64177001b31ed10',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2025-11-15T23:54:01.050Z',
    updatedAt: '2025-11-15T23:54:01.233Z',
    number: 94295
  },
  name: 'Флюоресцентный люминесцентный бургер'
};

describe('Проверка слайса заказов', () => {
  const preloadedState = {
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
  };
  let store = configureStore({
    reducer: OrdersSlice.reducer
  });
  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: OrdersSlice.reducer,
      preloadedState
    });
  });
  describe('Общие заказы', () => {
    test('Проверка обработки запроса', async () => {
      (getFeedsApi as jest.Mock<() => Promise<any>>).mockResolvedValue(
        mockedOrders
      );
      store.dispatch(getFeeds());
      expect(store.getState().isOrdersRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (getFeedsApi as jest.Mock<() => Promise<any>>).mockResolvedValue(
        mockedOrders
      );
      await store.dispatch(getFeeds());
      expect(store.getState().isOrdersRequest).toBe(false);
      expect(store.getState().ordersData).toEqual(mockedOrders);
    });
    test('Проверка ошибки выполнения запроса', async () => {
      (getFeedsApi as jest.Mock<() => Promise<any>>).mockRejectedValue(
        'ошибка'
      );
      await store.dispatch(getFeeds());
      expect(store.getState().isOrdersRequest).toBe(false);
      expect(store.getState().ordersError).toBe('ошибка');
    });
  });
  describe('Заказы пользователя', () => {
    test('Проверка обработки запроса', async () => {
      (getOrdersApi as jest.Mock<() => Promise<TOrder[]>>).mockResolvedValue(
        mockedOrders.orders
      );
      store.dispatch(getUserOrders());
      expect(store.getState().isUserOrdersRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (getOrdersApi as jest.Mock<() => Promise<TOrder[]>>).mockResolvedValue(
        mockedOrders.orders
      );

      await store.dispatch(getUserOrders());
      expect(store.getState().isUserOrdersRequest).toBe(false);
      expect(store.getState().userOrders).toEqual(mockedOrders.orders);
    });
    test('Проверка ошибки выполнения запроса', async () => {
      (getOrdersApi as jest.Mock<() => Promise<TOrder[]>>).mockRejectedValue(
        'ошибка'
      );
      await store.dispatch(getUserOrders());
      expect(store.getState().isUserOrdersRequest).toBe(false);
      expect(store.getState().userOrdersError).toBe('ошибка');
    });
  });
  describe('Создание заказа', () => {
    test('Проверка обработки запроса', async () => {
      (
        orderBurgerApi as unknown as jest.Mock<
          (data: string[]) => Promise<{ order: TOrder; name: string }>
        >
      ).mockResolvedValue(newOrderMock);
      store.dispatch(postOrder(newOrderMock.order.ingredients));
      expect(store.getState().postOrderRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (
        orderBurgerApi as unknown as jest.Mock<
          (data: string[]) => Promise<{ order: TOrder; name: string }>
        >
      ).mockResolvedValue(newOrderMock);
      await store.dispatch(postOrder(newOrderMock.order.ingredients));
      expect(store.getState().postOrderRequest).toBe(false);
      expect(store.getState().orderModalData).toEqual(newOrderMock.order);
    });
    test('Проверка ошибки при обработке запроса', async () => {
      (
        orderBurgerApi as unknown as jest.Mock<
          (data: string[]) => Promise<{ order: TOrder; name: string }>
        >
      ).mockRejectedValue('ошибка');
      await store.dispatch(postOrder(newOrderMock.order.ingredients));
      expect(store.getState().postOrderRequest).toBe(false);
      expect(store.getState().postOrderError).toBe('ошибка');
    });
  });
  describe('Проверка получения заказа по номеру', () => {
    test('Проверка обработки запроса', async () => {
      (
        getOrderByNumberApi as unknown as jest.Mock<
          () => Promise<{ orders: TOrder[] }>
        >
      ).mockResolvedValue(mockedOrders);
      store.dispatch(getOrderByNumber(94295));
      expect(store.getState().orderByNumberRequest).toBe(true);
    });
    test('Проверка успешного выполнения запроса', async () => {
      (
        getOrderByNumberApi as unknown as jest.Mock<
          () => Promise<{ orders: TOrder[] }>
        >
      ).mockResolvedValue(mockedOrders);
      await store.dispatch(getOrderByNumber(94295));
      expect(store.getState().orderByNumberRequest).toBe(false);
      expect(store.getState().orderModalData).toEqual(mockedOrders.orders[0]);
    });
    test('Проверка ошибки при обработке запроса', async () => {
      (
        getOrderByNumberApi as unknown as jest.Mock<() => Promise<TOrder>>
      ).mockRejectedValue('ошибка');
      await store.dispatch(getOrderByNumber(94295));
      expect(store.getState().orderByNumberRequest).toBe(false);
      expect(store.getState().orderByNumberError).toBe('ошибка');
    });
  });
  test('Проверка очистки данных модального окна', async () => {
    (
      getOrderByNumberApi as unknown as jest.Mock<
        () => Promise<{ orders: TOrder[] }>
      >
    ).mockResolvedValue(mockedOrders);
    await store.dispatch(getOrderByNumber(94295));
    expect(store.getState().orderModalData).toEqual(mockedOrders.orders[0]);
    store.dispatch(orderModalDataClear());
    expect(store.getState().orderModalData).toEqual(null);
  });
});
