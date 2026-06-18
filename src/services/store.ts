import { combineSlices, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineSlices();

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
