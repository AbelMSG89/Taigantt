import { apiClient } from '../api';
import type { LoginRequest, LoginResponse } from '../types';

export class AuthService {
  static async normalLogin(credentials: Omit<LoginRequest, 'type'>): Promise<LoginResponse> {
    try {
      const loginData: LoginRequest = {
        type: 'normal',
        username: credentials.username,
        password: credentials.password,
      };

      const response = await apiClient.post<LoginResponse>('/auth', loginData);
      
      if (response.data.auth_token) {
        localStorage.setItem('auth_token', response.data.auth_token);
        localStorage.setItem('id', String(response.data.id));
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        const apiError = error.response.data;
        if (apiError.code === 'invalid_credentials') {
          throw new Error('No active account found with the given credentials');
        } else if (apiError.message) {
          throw new Error(apiError.message);
        } else {
          throw new Error('Unauthorized. Please check your credentials.');
        }
      } else if (error.response?.data) {
        throw new Error('Login error. Please try again.');
      }
      throw new Error('Connection error. Please try again.');
    }
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('id');
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static getCurrentUserId(): string | null {
    const id = localStorage.getItem('id');
    return id ? id : null;
  }
}

export const normalLogin = AuthService.normalLogin;
export const logout = AuthService.logout;
export const isAuthenticated = AuthService.isAuthenticated;
export const getToken = AuthService.getToken;
export const getCurrentUserId = AuthService.getCurrentUserId;