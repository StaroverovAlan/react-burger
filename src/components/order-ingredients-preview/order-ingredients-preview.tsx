import type { TIngredient } from '@utils/types';

import styles from './order-ingredients-preview.module.css';

type TOrderIngredientsPreviewProps = {
  ingredients: TIngredient[];
  maxVisible?: number;
};

export const OrderIngredientsPreview = ({
  ingredients,
  maxVisible = 6,
}: TOrderIngredientsPreviewProps): React.JSX.Element => {
  const visibleIngredients = ingredients.slice(0, maxVisible);
  const hiddenCount = ingredients.length - visibleIngredients.length;

  return (
    <ul className={styles.list}>
      {visibleIngredients.map((ingredient, index) => {
        const isLastVisible = index === visibleIngredients.length - 1;
        const shouldShowCounter = isLastVisible && hiddenCount > 0;

        return (
          <li
            className={styles.item}
            key={`${ingredient._id}-${index}`}
            style={{ zIndex: visibleIngredients.length - index }}
          >
            <img
              className={styles.image}
              src={ingredient.image_mobile}
              alt={ingredient.name}
            />

            {shouldShowCounter && (
              <span className={`${styles.counter} text text_type_digits-default`}>
                +{hiddenCount}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
