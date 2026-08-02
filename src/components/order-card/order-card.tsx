import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { OrderIngredientsPreview } from '@components/order-ingredients-preview/order-ingredients-preview';
import { useAppSelector } from '@services/hooks';
import { getIngredients } from '@services/ingredients/slice';
import {
  formatOrderDate,
  getOrderIngredients,
  getOrderPrice,
  getOrderStatusText,
} from '@utils/order';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  basePath: string;
  showStatus?: boolean;
};

export const OrderCard = ({
  order,
  basePath,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const ingredients = useAppSelector(getIngredients);
  const orderIngredients = getOrderIngredients(order, ingredients);
  const price = getOrderPrice(order, ingredients);
  const statusText = getOrderStatusText(order.status);

  return (
    <Link
      className={`${styles.card} p-6`}
      to={`${basePath}/${order.number}`}
      state={{ backgroundLocation: location }}
    >
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>
      </div>

      <h2 className={`${styles.title} text text_type_main-medium mt-6 mb-2`}>
        {order.name ?? 'Космический бургер'}
      </h2>

      {showStatus && (
        <p
          className={`${styles.status} ${
            order.status === 'done' ? styles.status_done : ''
          } text text_type_main-default mt-0 mb-6`}
        >
          {statusText}
        </p>
      )}

      <div className={`${styles.footer} ${showStatus ? '' : 'mt-6'}`}>
        <OrderIngredientsPreview ingredients={orderIngredients} />

        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
