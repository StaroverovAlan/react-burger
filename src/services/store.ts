import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/slice';
import { burgerConstructorSlice } from './burger-constructor/slice';
import { feedMiddleware } from './feed/middleware';
import { feedSlice } from './feed/slice';
import { ingredientDetailsSlice } from './ingredient-details/slice';
import { ingredientsSlice } from './ingredients/slice';
import { orderInfoSlice } from './order-info/slice';
import { orderSlice } from './order/slice';
import { passwordSlice } from './password/slice';
import { profileOrdersMiddleware } from './profile-orders/middleware';
import { profileOrdersSlice } from './profile-orders/slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  ingredientDetailsSlice,
  burgerConstructorSlice,
  orderSlice,
  authSlice,
  passwordSlice,
  feedSlice,
  profileOrdersSlice,
  orderInfoSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
