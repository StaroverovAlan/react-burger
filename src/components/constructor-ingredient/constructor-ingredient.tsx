import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { moveIngredient, removeIngredient } from '@services/burger-constructor/slice';
import { useAppDispatch } from '@services/hooks';
import { DND_TYPES } from '@utils/constants';

import type { TConstructorIngredient } from '@utils/types';

import styles from './constructor-ingredient.module.css';

type TDragConstructorIngredient = {
  uniqueId: string;
  index: number;
};

type TConstructorIngredientProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

export const ConstructorIngredient = ({
  ingredient,
  index,
}: TConstructorIngredientProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredientRef = useRef<HTMLLIElement | null>(null);

  const [, dropRef] = useDrop<TDragConstructorIngredient>({
    accept: DND_TYPES.constructorIngredient,
    hover: (draggedIngredient, monitor) => {
      if (!ingredientRef.current) {
        return;
      }

      const dragIndex = draggedIngredient.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ingredientRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));

      draggedIngredient.index = hoverIndex;
    },
  });

  const [{ isDragging }, dragRef] = useDrag<
    TDragConstructorIngredient,
    unknown,
    { isDragging: boolean }
  >({
    type: DND_TYPES.constructorIngredient,
    item: {
      uniqueId: ingredient.uniqueId,
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(dropRef(ingredientRef));

  return (
    <li
      ref={ingredientRef}
      className={styles.constructor_item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />

      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => dispatch(removeIngredient(ingredient.uniqueId))}
      />
    </li>
  );
};
