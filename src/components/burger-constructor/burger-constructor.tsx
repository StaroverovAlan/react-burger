import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import { ConstructorIngredient } from '@components/constructor-ingredient/constructor-ingredient';
import {
  addIngredient,
  getConstructorBun,
  getConstructorIngredients,
  getTotalPrice,
} from '@services/burger-constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { DND_TYPES } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderClick: () => void;
  isOrderLoading: boolean;
};

export const BurgerConstructor = ({
  onOrderClick,
  isOrderLoading,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const constructorRef = useRef<HTMLElement | null>(null);

  const bun = useAppSelector(getConstructorBun);
  const constructorIngredients = useAppSelector(getConstructorIngredients);
  const totalPrice = useAppSelector(getTotalPrice);

  const [{ isOver }, dropRef] = useDrop<TIngredient, void, { isOver: boolean }>({
    accept: DND_TYPES.ingredient,
    drop: (ingredient) => {
      dispatch(addIngredient(ingredient));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  dropRef(constructorRef);

  return (
    <section
      ref={constructorRef}
      className={`${styles.burger_constructor} ${isOver ? styles.constructor_hover : ''}`}
    >
      <div className={`${styles.locked_element} ml-8`}>
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={`${styles.placeholder} ${styles.placeholder_top}`}>
            <span className="text text_type_main-default">Выберите булки</span>
          </div>
        )}
      </div>

      <ul className={`${styles.constructor_list} custom-scroll`}>
        {constructorIngredients.length > 0 ? (
          constructorIngredients.map((ingredient, index) => (
            <ConstructorIngredient
              key={ingredient.uniqueId}
              ingredient={ingredient}
              index={index}
            />
          ))
        ) : (
          <li className={`${styles.placeholder} ml-8`}>
            <span className="text text_type_main-default">Выберите начинку</span>
          </li>
        )}
      </ul>

      <div className={`${styles.locked_element} ml-8`}>
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={`${styles.placeholder} ${styles.placeholder_bottom}`}>
            <span className="text text_type_main-default">Выберите булки</span>
          </div>
        )}
      </div>

      <div className={`${styles.order} mt-10`}>
        <div className={styles.price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>

        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={onOrderClick}
          disabled={!bun || isOrderLoading}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
