// lib/api/suppliers.ts
import apiClient, { type ApiResponse } from './client';
import type { Supplier } from '@/types/api';

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      return [];
    }
  },

  getById: async (id: number): Promise<Supplier | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
      return null;
    }
  },
};