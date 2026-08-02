import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';
import { getIngredients } from '@services/ingredients/slice';
import {
  formatOrderDate,
  getOrderPrice,
  getOrderStatusText,
  getUniqueOrderIngredients,
} from '@utils/order';

import type { TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order: TOrder;
};

export const OrderInfo = ({ order }: TOrderInfoProps): React.JSX.Element => {
  const ingredients = useAppSelector(getIngredients);
  const orderIngredients = getUniqueOrderIngredients(order, ingredients);
  const price = getOrderPrice(order, ingredients);
  const statusText = getOrderStatusText(order.status);

  return (
    <article className={styles.info}>
      <p className={`${styles.number} text text_type_digits-default mt-0 mb-10`}>
        #{order.number}
      </p>

      <h1 className="text text_type_main-medium mt-0 mb-3">
        {order.name ?? 'Космический бургер'}
      </h1>

      <p
        className={`${styles.status} ${order.status === 'done' ? styles.status_done : ''} text text_type_main-default mt-0 mb-15`}
      >
        {statusText}
      </p>

      <h2 className="text text_type_main-medium mt-0 mb-6">Состав:</h2>

      <ul className={`${styles.ingredients} pr-6 mt-0 mb-10`}>
        {orderIngredients.map((ingredient) => (
          <li className={`${styles.ingredient} mb-4`} key={ingredient._id}>
            <div className={styles.icon_wrapper}>
              <img
                className={styles.icon}
                src={ingredient.image_mobile}
                alt={ingredient.name}
              />
            </div>

            <p className="text text_type_main-default m-0">{ingredient.name}</p>

            <div className={styles.ingredient_price}>
              <span className="text text_type_digits-default">
                {ingredient.count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>

        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </article>
  );
};
