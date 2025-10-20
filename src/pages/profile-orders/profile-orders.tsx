import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getUserOrders,
  getUserOrdersData
} from '../../services/slices/OrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getUserOrdersData) || [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [orders]);

  return <ProfileOrdersUI orders={orders} />;
};
