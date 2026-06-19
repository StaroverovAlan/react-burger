import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const bun = useAppSelector((state): TIngredient | null => state.burgerConstructor.bun);

  const constructorIngredients = useAppSelector(
    (state): TConstructorIngredient[] => state.burgerConstructor.ingredients
  );

  const totalPrice = useAppSelector((state): number => {
    const bunPrice = state.burgerConstructor.bun
      ? state.burgerConstructor.bun.price * 2
      : 0;

    const ingredientsPrice = state.burgerConstructor.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  });

  return (
    <section className={styles.burger_constructor}>
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
          constructorIngredients.map((ingredient) => (
            <li className={styles.constructor_item} key={ingredient.uniqueId}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
              />
            </li>
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

        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
