import { Link } from 'react-router-dom';

import styles from './not-found-page.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className={styles.page}>
      <p className={`${styles.code} text text_type_digits-large m-0`}>404</p>
      <p className="text text_type_main-medium mt-6 mb-10">Страница не найдена</p>
      <Link className={`${styles.link} text text_type_main-default`} to="/">
        Вернуться на главную
      </Link>
    </main>
  );
};
