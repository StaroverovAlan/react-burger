import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { getUser } from '@services/auth/slice';
import { getOrderIngredientIds } from '@services/burger-constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { getIngredientsError, getIngredientsLoading } from '@services/ingredients/slice';
import { createOrder } from '@services/order/actions';
import { getOrderLoading } from '@services/order/slice';

import type { TIngredient } from '@utils/types';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector(getUser);
  const orderIngredientIds = useAppSelector(getOrderIngredientIds);
  const isOrderLoading = useAppSelector(getOrderLoading);
  const isLoading = useAppSelector(getIngredientsLoading);
  const error = useAppSelector(getIngredientsError);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient): void => {
      void navigate(`/ingredients/${ingredient._id}`, {
        state: { backgroundLocation: location },
      });
    },
    [location, navigate]
  );

  const handleOrderClick = useCallback((): void => {
    if (!user) {
      void navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (orderIngredientIds.length === 0) {
      return;
    }

    void dispatch(createOrder(orderIngredientIds));
  }, [dispatch, location, navigate, orderIngredientIds, user]);

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      {isLoading && <Preloader />}

      {error && (
        <p className="text text_type_main-medium text_color_inactive pl-5">
          Не удалось загрузить ингредиенты
        </p>
      )}

      {!isLoading && !error && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients onIngredientClick={handleIngredientClick} />
          <BurgerConstructor
            onOrderClick={handleOrderClick}
            isOrderLoading={isOrderLoading}
          />
        </main>
      )}
    </>
  );
};
