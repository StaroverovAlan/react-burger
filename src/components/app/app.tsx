import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredientsApi } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    getIngredientsApi()
      .then((response) => {
        setIngredients(response.data);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleIngredientClick = useCallback((ingredient: TIngredient) => {
    setSelectedIngredient(ingredient);
  }, []);

  const handleOrderClick = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseIngredientModal = useCallback(() => {
    setSelectedIngredient(null);
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      {isLoading && <Preloader />}

      {hasError && (
        <p className="text text_type_main-medium text_color_inactive pl-5">
          Не удалось загрузить ингредиенты
        </p>
      )}

      {!isLoading && !hasError && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            ingredients={ingredients}
            onIngredientClick={handleIngredientClick}
          />
          <BurgerConstructor ingredients={ingredients} onOrderClick={handleOrderClick} />
        </main>
      )}

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
