import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  getProfileOrders,
  getProfileOrdersError,
  getProfileOrdersLoading,
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/profile-orders/slice';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getProfileOrders);
  const isLoading = useAppSelector(getProfileOrdersLoading);
  const error = useAppSelector(getProfileOrdersError);
  const orderedOrders = [...orders].reverse();

  useEffect(() => {
    dispatch(profileOrdersConnect());

    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <div className={styles.page}>
      {error && (
        <p className="text text_type_main-default text_color_inactive mt-0 mb-6">
          {error}
        </p>
      )}

      <section className={styles.list}>
        {orderedOrders.map((order) => (
          <OrderCard
            basePath="/profile/orders"
            key={order._id}
            order={order}
            showStatus
          />
        ))}
      </section>
    </div>
  );
};
