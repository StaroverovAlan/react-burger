import { IngredientDetailsContainer } from '@components/ingredient-details-container/ingredient-details-container';

import styles from './ingredient-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mt-30 mb-6">Детали ингредиента</h1>
      <IngredientDetailsContainer />
    </main>
  );
};
