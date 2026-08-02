import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { OrdersStatus } from '@components/orders-status/orders-status';
import {
  feedConnect,
  feedDisconnect,
  getFeedError,
  getFeedLoading,
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
} from '@services/feed/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getFeedOrders);
  const total = useAppSelector(getFeedTotal);
  const totalToday = useAppSelector(getFeedTotalToday);
  const isLoading = useAppSelector(getFeedLoading);
  const error = useAppSelector(getFeedError);

  useEffect(() => {
    dispatch(feedConnect());

    return (): void => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mt-0 mb-5">Лента заказов</h1>

      {isLoading && orders.length === 0 && <Preloader />}

      {error && (
        <p className="text text_type_main-default text_color_inactive mt-6 mb-0">
          {error}
        </p>
      )}

      {orders.length > 0 && (
        <div className={styles.content}>
          <section className={styles.list}>
            {orders.map((order) => (
              <OrderCard basePath="/feed" key={order._id} order={order} />
            ))}
          </section>

          <OrdersStatus orders={orders} total={total} totalToday={totalToday} />
        </div>
      )}
    </main>
  );
};
