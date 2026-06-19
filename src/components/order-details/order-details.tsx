import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';
import { getOrderNumber } from '@services/order/slice';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const orderNumber = useAppSelector(getOrderNumber);

  return (
    <section className={styles.details}>
      <p className={`${styles.order_number} text text_type_digits-large mt-4 mb-8`}>
        {orderNumber}
      </p>

      <p className="text text_type_main-medium mt-0 mb-15">идентификатор заказа</p>

      <div className={styles.icon_wrapper}>
        <CheckMarkIcon type="primary" />
      </div>

      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>

      <p className="text text_type_main-default text_color_inactive m-0">
        Дождитесь готовности на орбитальной станции
      </p>
    </section>
  );
};
