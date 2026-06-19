import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';

import { DND_TYPES } from '@utils/constants';

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
  const cardRef = useRef<HTMLLIElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag<
    TIngredient,
    unknown,
    { isDragging: boolean }
  >({
    type: DND_TYPES.ingredient,
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(cardRef);
  return (
    <li
      ref={cardRef}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick(ingredient)}
    >
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
