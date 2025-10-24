// lib/api/stock.ts
import apiClient, { type ApiResponse } from './client';
import type { Stock, CreateStockRequest } from '@/types/api';

export const stockApi = {
  // Get all stock
  getAll: async (): Promise<Stock[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Stock[]>>('/stocks');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch stock:', error);
      return [];
    }
  },

  // Get low stock
  getLowStock: async (threshold: number = 10): Promise<Stock[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Stock[]>>(
        `/stocks/low?threshold=${threshold}`
      );
      return response.data.data || [];
    } catch (error) {
      console.warn('Low stock endpoint not available, returning empty array');
      return [];
    }
  },

  // Get by product
  getByProduct: async (productId: number): Promise<Stock[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Stock[]>>(
        `/stocks/product/${productId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch stock by product:', error);
      return [];
    }
  },

  // Get total stock for product
  getTotalStock: async (productId: number): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        `/stocks/product/${productId}/total`
      );
      return response.data.data || 0;
    } catch (error) {
      console.error('Failed to fetch total stock:', error);
      return 0;
    }
  },

  // Get available stock for product
  getAvailableStock: async (productId: number): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        `/stocks/product/${productId}/available`
      );
      return response.data.data || 0;
    } catch (error) {
      console.error('Failed to fetch available stock:', error);
      return 0;
    }
  },

  // Get expiring stock
  getExpiring: async (daysAhead: number = 30): Promise<Stock[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Stock[]>>(
        `/stocks/expiring?daysAhead=${daysAhead}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch expiring stock:', error);
      return [];
    }
  },

  // Get expired stock
  getExpired: async (): Promise<Stock[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Stock[]>>('/stocks/expired');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch expired stock:', error);
      return [];
    }
  },

  // Add stock
  addStock: async (stock: CreateStockRequest): Promise<Stock | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Stock>>('/stocks', stock);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to add stock:', error);
      throw error;
    }
  },

  // Adjust stock
  adjustStock: async (stockId: number, newQuantity: number): Promise<boolean> => {
    try {
      await apiClient.put(`/stocks/${stockId}/adjust`, null, {
        params: { newQuantity }
      });
      return true;
    } catch (error) {
      console.error('Failed to adjust stock:', error);
      return false;
    }
  },

  // Reserve stock
  reserveStock: async (productId: number, quantity: number): Promise<boolean> => {
    try {
      await apiClient.post(`/stocks/${productId}/reserve`, null, {
        params: { quantity }
      });
      return true;
    } catch (error) {
      console.error('Failed to reserve stock:', error);
      return false;
    }
  },

  // Release stock
  releaseStock: async (productId: number, quantity: number): Promise<boolean> => {
    try {
      await apiClient.post(`/stocks/${productId}/release`, null, {
        params: { quantity }
      });
      return true;
    } catch (error) {
      console.error('Failed to release stock:', error);
      return false;
    }
  },
};