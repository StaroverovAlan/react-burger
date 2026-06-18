import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsSlice } from './ingredients/slice';

const rootReducer = combineSlices(ingredientsSlice);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
