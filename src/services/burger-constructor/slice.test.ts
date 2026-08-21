import { describe, expect, it } from 'vitest';

import { ingredients } from '@utils/ingredients';

import {
  addIngredient,
  burgerConstructorSlice,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './slice';

import type { TConstructorIngredient } from '@utils/types';

const reducer = burgerConstructorSlice.reducer;
const bun = ingredients[0];
const mainIngredient = ingredients[1];
const sauce = ingredients[3];

const constructorIngredient: TConstructorIngredient = {
  ...mainIngredient,
  uniqueId: 'main-1',
};

const secondConstructorIngredient: TConstructorIngredient = {
  ...sauce,
  uniqueId: 'sauce-1',
};

describe('burgerConstructorSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('добавляет булку в отдельное поле bun', (): void => {
    const result = reducer(undefined, addIngredient(bun));

    expect(result.bun?._id).toBe(bun._id);
    expect(result.ingredients).toHaveLength(0);
  });

  it('заменяет старую булку новой булкой', (): void => {
    const newBun = ingredients[14];
    const state = reducer(undefined, addIngredient(bun));
    const result = reducer(state, addIngredient(newBun));

    expect(result.bun?._id).toBe(newBun._id);
    expect(result.ingredients).toHaveLength(0);
  });

  it('добавляет начинку в список ingredients и добавляет uniqueId', (): void => {
    const result = reducer(undefined, addIngredient(mainIngredient));

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toMatchObject(mainIngredient);
    expect(typeof result.ingredients[0]?.uniqueId).toBe('string');
  });

  it('удаляет ингредиент из конструктора по uniqueId', (): void => {
    const result = reducer(
      {
        bun,
        ingredients: [constructorIngredient, secondConstructorIngredient],
      },
      removeIngredient('main-1')
    );

    expect(result.ingredients).toEqual([secondConstructorIngredient]);
  });

  it('перемещает ингредиент в конструкторе', (): void => {
    const result = reducer(
      {
        bun,
        ingredients: [constructorIngredient, secondConstructorIngredient],
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(result.ingredients).toEqual([
      secondConstructorIngredient,
      constructorIngredient,
    ]);
  });

  it('не ломает состояние при перемещении несуществующего индекса', (): void => {
    const result = reducer(
      {
        bun,
        ingredients: [constructorIngredient],
      },
      moveIngredient({ fromIndex: 10, toIndex: 0 })
    );

    expect(result.ingredients).toEqual([constructorIngredient]);
  });

  it('очищает конструктор', (): void => {
    const result = reducer(
      {
        bun,
        ingredients: [constructorIngredient],
      },
      clearConstructor()
    );

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
