import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');

  const bunsRef = useRef<HTMLElement | null>(null);
  const saucesRef = useRef<HTMLElement | null>(null);
  const mainsRef = useRef<HTMLElement | null>(null);

  const buns = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );

  const sauces = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    [ingredients]
  );

  const mains = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'main'),
    [ingredients]
  );

  const handleTabClick = useCallback((tab: string): void => {
    const ingredientType = tab as TIngredientType;

    setCurrentTab(ingredientType);

    if (ingredientType === 'bun') {
      bunsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (ingredientType === 'sauce') {
      saucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (ingredientType === 'main') {
      mainsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </ul>
      </nav>

      <div className={`${styles.ingredients_list} custom-scroll`}>
        <section ref={bunsRef}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>
          <ul className={styles.cards}>
            {buns.map((ingredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                count={ingredient._id === buns[0]?._id ? 1 : 0}
                onClick={onIngredientClick}
              />
            ))}
          </ul>
        </section>

        <section ref={saucesRef}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>
          <ul className={styles.cards}>
            {sauces.map((ingredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                onClick={onIngredientClick}
              />
            ))}
          </ul>
        </section>

        <section ref={mainsRef}>
          <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>
          <ul className={styles.cards}>
            {mains.map((ingredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                onClick={onIngredientClick}
              />
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};
