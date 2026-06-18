import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
  count?: number;
  onClick: (ingredient: TIngredient) => void;
};

export const IngredientCard = ({
  ingredient,
  count = 0,
  onClick,
}: TIngredientCardProps): React.JSX.Element => {
  return (
    <li className={styles.card} onClick={() => onClick(ingredient)}>
      {count > 0 && <Counter count={count} size="default" extraClass="m-1" />}

      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />

      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};
