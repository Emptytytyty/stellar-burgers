import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  getIngredients,
  getIngredientsAction
} from '../../services/slices/IngredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getIsOrderByNumberRequest,
  getOrderByNumber,
  getOrderModalData
} from '../../services/slices/OrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const params = useParams();
  const dispatch = useDispatch();
  const orderData = useSelector(getOrderModalData);
  const isOrderDataRequest = useSelector(getIsOrderByNumberRequest);

  const ingredients: TIngredient[] = useSelector(getIngredients);

  useEffect(() => {
    if (!ingredients.length) dispatch(getIngredientsAction());
    dispatch(getOrderByNumber(+params.number!));
  }, [ingredients.length]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isOrderDataRequest || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
