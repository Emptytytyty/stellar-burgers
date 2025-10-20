import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorClear,
  getBurgerConstructorIngredients,
  getConstructorOrderData
} from '../../services/slices/BurgerConstructorSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getIsAuthenticated,
  getUserData
} from '../../services/slices/UserSlice';
import {
  getOrderModalData,
  getPostOrdersRequest,
  orderModalDataClear,
  postOrder
} from '../../services/slices/OrdersSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = useSelector(getBurgerConstructorIngredients);
  const orderRequest = useSelector(getPostOrdersRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const order = useSelector(getConstructorOrderData);

  const onOrderClick = () => {
    if (!isAuthenticated) navigate('/login');
    if (!constructorItems.bun || orderRequest) return null;
    if (isAuthenticated && !orderRequest) {
      if (order.every((item) => item !== undefined))
        dispatch(postOrder(order as string[])).then(() =>
          dispatch(burgerConstructorClear())
        );
    }
  };
  const closeOrderModal = () => {
    dispatch(orderModalDataClear());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
