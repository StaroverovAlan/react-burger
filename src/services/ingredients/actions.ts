import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@utils/api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);
