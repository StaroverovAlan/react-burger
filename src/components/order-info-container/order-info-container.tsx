import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { getFeedOrders } from '@services/feed/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchOrderByNumber } from '@services/order-info/actions';
import {
  clearOrderInfo,
  getOrderInfo,
  getOrderInfoError,
  getOrderInfoLoading,
} from '@services/order-info/slice';
import { getProfileOrders } from '@services/profile-orders/slice';

import styles from './order-info-container.module.css';

export const OrderInfoContainer = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useAppDispatch();
  const feedOrders = useAppSelector(getFeedOrders);
  const profileOrders = useAppSelector(getProfileOrders);
  const cachedOrder = useAppSelector(getOrderInfo);
  const isLoading = useAppSelector(getOrderInfoLoading);
  const error = useAppSelector(getOrderInfoError);

  const orderFromStore = [...feedOrders, ...profileOrders].find(
    (order) => String(order.number) === number
  );
  const order =
    orderFromStore ?? (String(cachedOrder?.number) === number ? cachedOrder : null);

  useEffect(() => {
    if (!number || orderFromStore || String(cachedOrder?.number) === number) {
      return;
    }

    void dispatch(fetchOrderByNumber(number));
  }, [cachedOrder, dispatch, number, orderFromStore]);

  useEffect(() => {
    return (): void => {
      dispatch(clearOrderInfo());
    };
  }, [dispatch]);

  if (isLoading && !order) {
    return <Preloader />;
  }

  if (order) {
    return <OrderInfo order={order} />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium text_color_inactive`}>
        Не удалось загрузить заказ
      </p>
    );
  }

  return (
    <p className={`${styles.message} text text_type_main-medium text_color_inactive`}>
      Заказ не найден
    </p>
  );
};
