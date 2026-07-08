import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  clearConstructor,
  getOrderIngredientIds,
} from '@services/burger-constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  clearSelectedIngredient,
  getSelectedIngredient,
  setSelectedIngredient,
} from '@services/ingredient-details/slice';
import { fetchIngredients } from '@services/ingredients/actions';
import { getIngredientsError, getIngredientsLoading } from '@services/ingredients/slice';
import { createOrder } from '@services/order/actions';
import { clearOrder, getOrderLoading, getOrderNumber } from '@services/order/slice';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const orderIngredientIds = useAppSelector(getOrderIngredientIds);
  const orderNumber = useAppSelector(getOrderNumber);
  const isOrderLoading = useAppSelector(getOrderLoading);

  const isLoading = useAppSelector(getIngredientsLoading);
  const error = useAppSelector(getIngredientsError);

  const selectedIngredient = useAppSelector(getSelectedIngredient);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient) => {
      dispatch(setSelectedIngredient(ingredient));
    },
    [dispatch]
  );

  const handleOrderClick = useCallback(() => {
    if (orderIngredientIds.length === 0) {
      return;
    }

    void dispatch(createOrder(orderIngredientIds));
  }, [dispatch, orderIngredientIds]);

  const handleCloseIngredientModal = useCallback(() => {
    dispatch(clearSelectedIngredient());
  }, [dispatch]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

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

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {orderNumber && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
