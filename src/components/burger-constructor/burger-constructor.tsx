import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const bun = useMemo(
    () => ingredients.find((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );

  const fillingIngredients = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type !== 'bun').slice(0, 8),
    [ingredients]
  );

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingPrice = fillingIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + fillingPrice;
  }, [bun, fillingIngredients]);

  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <div className={`${styles.locked_element} ml-8`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <ul className={`${styles.constructor_list} custom-scroll`}>
        {fillingIngredients.map((ingredient, index) => (
          <li className={styles.constructor_item} key={`${ingredient._id}-${index}`}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>

      {bun && (
        <div className={`${styles.locked_element} ml-8`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.order} mt-10`}>
        <div className={styles.price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>

        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
