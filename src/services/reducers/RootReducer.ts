import { combineReducers } from 'redux';
import { IngredientsSlice } from '../slices/IngredientsSlice';
import { BurgerConstructorSlice } from '../slices/BurgerConstructorSlice';
import { UserSlice } from '../slices/UserSlice';
import { OrdersSlice } from '../slices/OrdersSlice';

export const RootReducer = combineReducers({
  ingredients: IngredientsSlice.reducer,
  burgerConstructor: BurgerConstructorSlice.reducer,
  user: UserSlice.reducer,
  orders: OrdersSlice.reducer
});
