import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uniqueId: nanoid(),
        },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.uniqueId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);

      if (movedIngredient) {
        state.ingredients.splice(toIndex, 0, movedIngredient);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  selectors: {
    getConstructorBun: (state): TIngredient | null => state.bun,
    getConstructorIngredients: (state): TConstructorIngredient[] => state.ingredients,
    getTotalPrice: createSelector(
      [
        (state: TBurgerConstructorState): TIngredient | null => state.bun,
        (state: TBurgerConstructorState): TConstructorIngredient[] => state.ingredients,
      ],
      (bun, ingredients): number => {
        const bunPrice = bun ? bun.price * 2 : 0;
        const ingredientsPrice = ingredients.reduce(
          (sum, ingredient) => sum + ingredient.price,
          0
        );

        return bunPrice + ingredientsPrice;
      }
    ),
    getIngredientCounters: createSelector(
      [
        (state: TBurgerConstructorState): TIngredient | null => state.bun,
        (state: TBurgerConstructorState): TConstructorIngredient[] => state.ingredients,
      ],
      (bun, ingredients): Record<string, number> => {
        const counters: Record<string, number> = {};

        if (bun) {
          counters[bun._id] = 2;
        }

        ingredients.forEach((ingredient) => {
          counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
        });

        return counters;
      }
    ),
    getOrderIngredientIds: createSelector(
      [
        (state: TBurgerConstructorState): TIngredient | null => state.bun,
        (state: TBurgerConstructorState): TConstructorIngredient[] => state.ingredients,
      ],
      (bun, ingredients): string[] => {
        if (!bun) {
          return [];
        }

        return [bun._id, ...ingredients.map((ingredient) => ingredient._id), bun._id];
      }
    ),
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  burgerConstructorSlice.actions;

export const {
  getConstructorBun,
  getConstructorIngredients,
  getTotalPrice,
  getIngredientCounters,
  getOrderIngredientIds,
} = burgerConstructorSlice.selectors;
