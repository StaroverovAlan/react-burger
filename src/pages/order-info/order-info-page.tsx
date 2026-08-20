import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderInfoContainer } from '@components/order-info-container/order-info-container';
import { feedConnect, feedDisconnect } from '@services/feed/slice';
import { useAppDispatch } from '@services/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/profile-orders/slice';

import styles from './order-info-page.module.css';

export const OrderInfoPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/feed/')) {
      dispatch(feedConnect());

      return (): void => {
        dispatch(feedDisconnect());
      };
    }

    if (location.pathname.startsWith('/profile/orders/')) {
      dispatch(profileOrdersConnect());

      return (): void => {
        dispatch(profileOrdersDisconnect());
      };
    }

    return undefined;
  }, [dispatch, location.pathname]);

  return (
    <main className={styles.page}>
      <OrderInfoContainer />
    </main>
  );
};
