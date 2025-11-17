import { combineReducers } from 'redux';
import { IngredientsSlice } from '../slices/Ingredients/IngredientsSlice';
import { BurgerConstructorSlice } from '../slices/BurgerConstructor/BurgerConstructorSlice';
import { UserSlice } from '../slices/User/UserSlice';
import { OrdersSlice } from '../slices/Orders/OrdersSlice';

export const RootReducer = combineReducers({
  ingredients: IngredientsSlice.reducer,
  burgerConstructor: BurgerConstructorSlice.reducer,
  user: UserSlice.reducer,
  orders: OrdersSlice.reducer
});
