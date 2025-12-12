/**
 * Authentication API Service
 */

import apiClient from './client';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/', data);
    
    // Store tokens in cookies
    Cookies.set('access_token', response.data.access_token, { expires: 1 / 24 }); // 1 hour
    Cookies.set('refresh_token', response.data.refresh_token, { expires: 7 }); // 7 days
    
    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/', data);
    
    // Store tokens in cookies
    Cookies.set('access_token', response.data.access_token, { expires: 1 / 24 }); // 1 hour
    Cookies.set('refresh_token', response.data.refresh_token, { expires: 7 }); // 7 days
    
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } finally {
      // Clear tokens regardless of API response
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ access_token: string }>('/auth/refresh/', {
      refresh_token: refreshToken,
    });

    const { access_token } = response.data;
    Cookies.set('access_token', access_token, { expires: 1 / 24 }); // 1 hour
    
    return access_token;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!Cookies.get('access_token');
  },
};

export default authService;
