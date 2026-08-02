export type TIngredientType = 'bun' | 'sauce' | 'main';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  uniqueId: string;
};

export type TUser = {
  email: string;
  name: string;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrder = {
  ingredients: string[];
  _id: string;
  status: TOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrderByNumberResponse = {
  success: boolean;
  orders: TOrder[];
};

export type TWebSocketErrorResponse = {
  success?: boolean;
  message: string;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TDefaultResponse = {
  success: boolean;
  message?: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TRegisterRequest = TLoginRequest & {
  name: string;
};

export type TUpdateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
};

export type TForgotPasswordRequest = {
  email: string;
};

export type TResetPasswordRequest = {
  password: string;
  token: string;
};
