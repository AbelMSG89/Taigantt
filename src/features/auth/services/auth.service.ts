import { apiClient } from '../../../lib/api.ts';
import type { LoginRequest, LoginResponse } from '@/features/auth/models/auth';
import { setAuthData, clearAuthData, isAuthenticated as checkIsAuthenticated, getStoredToken, getStoredUserId } from '@/utils/auth';
import { handleApiError } from '@/utils/error';
import { API_ENDPOINTS } from '@/constants/api';

export class AuthService {
  static async normalLogin(credentials: Omit<LoginRequest, 'type'>): Promise<LoginResponse> {
    try {
      const loginData: LoginRequest = {
        type: 'normal',
        username: credentials.username,
        password: credentials.password,
      };

      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH, loginData);
      
      if (response.data.auth_token) {
        setAuthData(response.data.auth_token, String(response.data.id));
      }

      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  static logout(): void {
    clearAuthData();
  }

  static isAuthenticated(): boolean {
    return checkIsAuthenticated();
  }

  static getToken(): string | null {
    return getStoredToken();
  }

  static getCurrentUserId(): string | null {
    return getStoredUserId();
  }
}

export const normalLogin = AuthService.normalLogin;
export const logout = AuthService.logout;
export const isAuthenticated = AuthService.isAuthenticated;
export const getToken = AuthService.getToken;
export const getCurrentUserId = AuthService.getCurrentUserId;