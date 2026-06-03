import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <section className={styles.details}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />

      <h3 className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</h3>

      <ul className={styles.nutrients}>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive mb-2">
            Калории, ккал
          </p>
          <p className="text text_type_digits-default text_color_inactive m-0">
            {ingredient.calories}
          </p>
        </li>

        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive mb-2">
            Белки, г
          </p>
          <p className="text text_type_digits-default text_color_inactive m-0">
            {ingredient.proteins}
          </p>
        </li>

        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive mb-2">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive m-0">
            {ingredient.fat}
          </p>
        </li>

        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive mb-2">
            Углеводы, г
          </p>
          <p className="text text_type_digits-default text_color_inactive m-0">
            {ingredient.carbohydrates}
          </p>
        </li>
      </ul>
    </section>
  );
};
