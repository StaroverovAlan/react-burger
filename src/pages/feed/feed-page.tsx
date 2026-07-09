import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large">Лента заказов</h1>
      <p className="text text_type_main-default text_color_inactive mt-6">
        Раздел будет реализован в следующем спринте.
      </p>
    </main>
  );
};
