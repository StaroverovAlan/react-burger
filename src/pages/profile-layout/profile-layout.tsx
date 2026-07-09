import { useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logoutUser } from '@services/auth/actions';
import { getAuthLoading } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './profile-layout.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string => {
  return `${styles.link} ${isActive ? styles.link_active : ''} text text_type_main-medium`;
};

export const ProfileLayout = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(getAuthLoading);

  const handleLogout = useCallback((): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => {
        void navigate('/login', { replace: true });
      });
  }, [dispatch, navigate]);

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <NavLink className={getLinkClassName} end to="/profile">
            Профиль
          </NavLink>

          <NavLink className={getLinkClassName} to="/profile/orders">
            История заказов
          </NavLink>

          <button
            className={`${styles.button} text text_type_main-medium`}
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Выход...' : 'Выход'}
          </button>
        </nav>

        <p className={`${styles.hint} text text_type_main-default text_color_inactive`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>

      <section className={styles.content}>
        <Outlet />
      </section>
    </main>
  );
};
