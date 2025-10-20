import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export type TOrdersState = {
  ordersData: TOrdersData | null;
  userOrders: TOrder[];
  isOrdersRequest: boolean;
  ordersError: null | string;
  isUserOrdersRequest: boolean;
  userOrdersError: null | string;
  postOrderRequest: boolean;
  postOrderError: null | string;
  orderModalData: null | TOrder;
  orderByNumberRequest: boolean;
  orderByNumberError: null | string;
};

const initialState: TOrdersState = {
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

export const getFeeds = createAsyncThunk(
  'orders/getFeeds',
  getFeedsApi
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  getOrdersApi
);

export const postOrder = createAsyncThunk(
  'orders/postOrder',
  orderBurgerApi
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  getOrderByNumberApi
);

export const OrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    orderModalDataClear: (state: TOrdersState) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getUserOrdersData: (state: TOrdersState) => state.userOrders,
    getOrdersData: (state: TOrdersState) => state.ordersData,
    getIsOrdersRequest: (state: TOrdersState) => state.isOrdersRequest,
    getIsUserOrdersRequest: (state: TOrdersState) => state.isUserOrdersRequest,
    getPostOrdersRequest: (state: TOrdersState) => state.postOrderRequest,
    getOrderModalData: (state: TOrdersState) => state.orderModalData,
    getIsOrderByNumberRequest: (state: TOrdersState) =>
      state.orderByNumberRequest,
    getTotalOrders: (state: TOrdersState) => state.ordersData?.orders.length,
    getTotalTodayOrders: (state: TOrdersState) =>
      state.ordersData?.orders.filter(
        (order) => new Date(order.createdAt).getDate === new Date().getDate
      ).length
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state: TOrdersState) => {
        state.isOrdersRequest = true;
        state.ordersError = null;
      })
      .addCase(getFeeds.rejected, (state: TOrdersState, action) => {
        state.isOrdersRequest = false;
        state.ordersError = action.payload as string;
      })
      .addCase(getFeeds.fulfilled, (state: TOrdersState, action) => {
        state.isOrdersRequest = false;
        state.ordersData = action.payload;
      })
      .addCase(getUserOrders.pending, (state: TOrdersState) => {
        state.isUserOrdersRequest = true;
        state.userOrdersError = null;
      })
      .addCase(getUserOrders.rejected, (state: TOrdersState, action) => {
        state.isUserOrdersRequest = false;
        state.userOrdersError = action.payload as string;
      })
      .addCase(getUserOrders.fulfilled, (state: TOrdersState, action) => {
        state.isUserOrdersRequest = false;
        state.userOrders = action.payload;
      })
      .addCase(postOrder.pending, (state: TOrdersState) => {
        state.postOrderRequest = true;
        state.postOrderError = null;
      })
      .addCase(postOrder.rejected, (state: TOrdersState, action) => {
        state.postOrderRequest = false;
        state.postOrderError = action.payload as string;
      })
      .addCase(postOrder.fulfilled, (state: TOrdersState, action) => {
        state.postOrderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(getOrderByNumber.pending, (state: TOrdersState) => {
        state.orderByNumberRequest = true;
        state.orderByNumberError = null;
      })
      .addCase(getOrderByNumber.rejected, (state: TOrdersState, action) => {
        state.orderByNumberRequest = false;
        state.orderByNumberError = action.payload as string;
      })
      .addCase(getOrderByNumber.fulfilled, (state: TOrdersState, action) => {
        state.orderByNumberRequest = false;
        state.orderModalData = action.payload.orders[0];
      });
  }
});

export const {
  getUserOrdersData,
  getIsOrdersRequest,
  getIsUserOrdersRequest,
  getOrdersData,
  getPostOrdersRequest,
  getOrderModalData,
  getTotalOrders,
  getTotalTodayOrders,
  getIsOrderByNumberRequest
} = OrdersSlice.selectors;

export const { orderModalDataClear } = OrdersSlice.actions;
