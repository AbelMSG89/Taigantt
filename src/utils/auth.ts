import { STORAGE_KEYS } from '@/constants/storage';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const getStoredUserId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

export const setAuthData = (token: string, userId: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
};

export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
};