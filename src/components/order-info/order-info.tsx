import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderByNumber,
  getOrderByNumber,
  selectOrderByNumber
} from '../../services/slices/orderSlice';
import {
  selectFeedOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const orderByNumber = useSelector(selectOrderByNumber);
  const ingredients = useSelector(selectIngredients);

  const orderData = useMemo(
    () =>
      [...feedOrders, ...profileOrders].find(
        (order) => order.number === orderNumber
      ) || orderByNumber,
    [feedOrders, profileOrders, orderByNumber, orderNumber]
  );

  useEffect(() => {
    if (!orderData && Number.isFinite(orderNumber)) {
      dispatch(getOrderByNumber(orderNumber));
    }

    return () => {
      dispatch(clearOrderByNumber());
    };
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData) return null;

    const ingredientsInfo = orderData.ingredients.reduce<{
      [key: string]: TIngredient & { count: number };
    }>((acc, ingredientId) => {
      const ingredient = ingredients.find((item) => item._id === ingredientId);

      if (!ingredient) {
        return acc;
      }

      if (!acc[ingredientId]) {
        acc[ingredientId] = {
          ...ingredient,
          count: 0
        };
      }

      acc[ingredientId].count += 1;

      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (acc, ingredient) => acc + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      total,
      date: new Date(orderData.createdAt)
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return null;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
