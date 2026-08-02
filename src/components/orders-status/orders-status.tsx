import type { TOrder } from '@utils/types';

import styles from './orders-status.module.css';

type TOrdersStatusProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const MAX_STATUS_ORDERS = 20;
const ORDERS_PER_COLUMN = 10;

const chunkOrders = <T,>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

export const OrdersStatus = ({
  orders,
  total,
  totalToday,
}: TOrdersStatusProps): React.JSX.Element => {
  const doneColumns = chunkOrders(
    orders.filter((order) => order.status === 'done').slice(0, MAX_STATUS_ORDERS),
    ORDERS_PER_COLUMN
  );
  const pendingColumns = chunkOrders(
    orders.filter((order) => order.status === 'pending').slice(0, MAX_STATUS_ORDERS),
    ORDERS_PER_COLUMN
  );

  return (
    <section className={styles.status}>
      <div className={styles.columns}>
        <div>
          <h2 className="text text_type_main-medium mt-0 mb-6">Готово:</h2>
          <div className={styles.number_columns}>
            {doneColumns.map((column, index) => (
              <ul className={styles.list} key={`done-${index}`}>
                {column.map((order) => (
                  <li
                    className={`${styles.done} text text_type_digits-default mb-2`}
                    key={order._id}
                  >
                    {order.number}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text text_type_main-medium mt-0 mb-6">В работе:</h2>
          <div className={styles.number_columns}>
            {pendingColumns.map((column, index) => (
              <ul className={styles.list} key={`pending-${index}`}>
                {column.map((order) => (
                  <li className="text text_type_digits-default mb-2" key={order._id}>
                    {order.number}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text text_type_main-medium mt-15 mb-0">Выполнено за все время:</h2>
      <p className={`${styles.total} text text_type_digits-large mt-0 mb-15`}>{total}</p>

      <h2 className="text text_type_main-medium mt-0 mb-0">Выполнено за сегодня:</h2>
      <p className={`${styles.total} text text_type_digits-large mt-0 mb-0`}>
        {totalToday}
      </p>
    </section>
  );
};
