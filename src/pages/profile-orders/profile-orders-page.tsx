import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  return (
    <div className={styles.page}>
      <h1 className="text text_type_main-medium mt-0 mb-6">История заказов</h1>
      <p className="text text_type_main-default text_color_inactive m-0">
        История заказов будет реализована позже.
      </p>
    </div>
  );
};
