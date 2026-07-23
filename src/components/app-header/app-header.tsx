import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink, useMatch } from 'react-router-dom';

import styles from './app-header.module.css';

const getLinkClassName = (isActive: boolean): string => {
  return `${styles.link} ${isActive ? styles.link_active : ''}`;
};

export const AppHeader = (): React.JSX.Element => {
  const ingredientMatch = useMatch('/ingredients/:id');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink className={styles.link_wrapper} end to="/">
            {({ isActive }) => {
              const isConstructorActive = isActive || Boolean(ingredientMatch);

              return (
                <span className={getLinkClassName(isConstructorActive)}>
                  <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
                  <span className="text text_type_main-default ml-2">Конструктор</span>
                </span>
              );
            }}
          </NavLink>

          <NavLink className={`${styles.link_wrapper} ml-10`} to="/feed">
            {({ isActive }) => (
              <span className={getLinkClassName(isActive)}>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className="text text_type_main-default ml-2">Лента заказов</span>
              </span>
            )}
          </NavLink>
        </div>

        <Link className={styles.logo} to="/" aria-label="Перейти на главную">
          <Logo />
        </Link>

        <NavLink
          className={`${styles.link_wrapper} ${styles.link_position_last}`}
          to="/profile"
        >
          {({ isActive }) => (
            <span className={getLinkClassName(isActive)}>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <span className="text text_type_main-default ml-2">Личный кабинет</span>
            </span>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
