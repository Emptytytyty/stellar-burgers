import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  getIsOrdersRequest,
  getOrdersData
} from '../../services/slices/OrdersSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getOrdersData)?.orders || [];
  const dispatch = useDispatch();
  const isOrdersRequest = useSelector(getIsOrdersRequest);

  useEffect(() => {
    dispatch(getFeeds());
  }, [orders.length]);

  if (isOrdersRequest) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
