import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const RESET_PASSWORD_ALLOWED_KEY = 'resetPasswordAllowed';

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

export const isTokenExists = (): boolean => {
  return Boolean(getAccessToken() ?? getRefreshToken());
};

export const setResetPasswordAllowed = (): void => {
  localStorage.setItem(RESET_PASSWORD_ALLOWED_KEY, 'true');
};

export const removeResetPasswordAllowed = (): void => {
  localStorage.removeItem(RESET_PASSWORD_ALLOWED_KEY);
};

export const isResetPasswordAllowed = (): boolean => {
  return localStorage.getItem(RESET_PASSWORD_ALLOWED_KEY) === 'true';
};
