// lib/api/auth.ts
import apiClient, { type ApiResponse } from './client';
import type { LoginRequest, AuthResponse, User } from '@/types/api';

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    
    if (response.data.success && response.data.data) {
      // Store token
      localStorage.setItem('accessToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Login failed');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch user');
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  // Get stored user
  getStoredUser: (): AuthResponse | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};