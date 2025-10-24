// lib/api/categories.ts
import apiClient, { type ApiResponse } from './client';
import type { Category } from '@/types/api';

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return response.data.data || [];
    } catch (error) {
      console.warn('Categories endpoint not available, returning empty array');
      return [];
    }
  },

  // Get by ID
  getById: async (id: number): Promise<Category | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return null;
    }
  },

  // Create category
  create: async (data: Omit<Category, 'id' | 'active' | 'createdAt' | 'updatedAt'>): Promise<Category | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create category:', error);
      return null;
    }
  },

  // Update category
  update: async (id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to update category:', error);
      return null;
    }
  },

  // Delete category
  delete: async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  },
};