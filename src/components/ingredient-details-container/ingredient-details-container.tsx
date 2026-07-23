import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useAppSelector } from '@services/hooks';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from '@services/ingredients/slice';

import styles from './ingredient-details-container.module.css';

export const IngredientDetailsContainer = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector(getIngredients);
  const isLoading = useAppSelector(getIngredientsLoading);
  const error = useAppSelector(getIngredientsError);

  const ingredient = ingredients.find((item) => item._id === id);

  if (isLoading || (!error && ingredients.length === 0)) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className="text text_type_main-medium text_color_inactive">
        Не удалось загрузить ингредиент
      </p>
    );
  }

  if (!ingredient) {
    return (
      <p className={`${styles.message} text text_type_main-medium text_color_inactive`}>
        Ингредиент не найден
      </p>
    );
  }

  return <IngredientDetails ingredient={ingredient} />;
};
