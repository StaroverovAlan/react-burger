import { describe, expect, it } from 'vitest';

import { ingredients } from '@utils/ingredients';

import {
  clearSelectedIngredient,
  ingredientDetailsSlice,
  setSelectedIngredient,
} from './slice';

const reducer = ingredientDetailsSlice.reducer;
const ingredient = ingredients[0];

describe('ingredientDetailsSlice', () => {
  it('возвращает начальное состояние', (): void => {
    const result = reducer(undefined, { type: '' });

    expect(result).toEqual({ ingredient: null });
  });

  it('сохраняет выбранный ингредиент', (): void => {
    const result = reducer(undefined, setSelectedIngredient(ingredient));

    expect(result.ingredient).toEqual(ingredient);
  });

  it('очищает выбранный ингредиент', (): void => {
    const result = reducer({ ingredient }, clearSelectedIngredient());

    expect(result.ingredient).toBeNull();
  });
});
