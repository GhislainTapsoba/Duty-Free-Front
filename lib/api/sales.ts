// lib/api/sales.ts
import apiClient, { type ApiResponse } from './client';
import type { Sale, CreateSaleRequest } from '@/types/api';

export const salesApi = {
  // Create sale
  create: async (sale: CreateSaleRequest): Promise<Sale | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Sale>>('/sales', sale);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create sale:', error);
      throw error;
    }
  },

  // Get all sales
  getAll: async (): Promise<Sale[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Sale[]>>('/sales');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      return [];
    }
  },

  // Get sale by ID
  getById: async (id: number): Promise<Sale | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Sale>>(`/sales/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch sale:', error);
      return null;
    }
  },

  // Get by sale number
  getBySaleNumber: async (saleNumber: string): Promise<Sale | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Sale>>(
        `/sales/number/${saleNumber}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch sale by number:', error);
      return null;
    }
  },

  // Get sales by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Sale[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Sale[]>>(
        `/sales/date-range?start=${startDate}&end=${endDate}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch sales by date range:', error);
      return [];
    }
  },

  // Get sales by cashier
  getByCashier: async (cashierId: number): Promise<Sale[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Sale[]>>(
        `/sales/cashier/${cashierId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch sales by cashier:', error);
      return [];
    }
  },

  // Get sales by cash register
  getByCashRegister: async (cashRegisterId: number): Promise<Sale[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Sale[]>>(
        `/sales/cash-register/${cashRegisterId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch sales by cash register:', error);
      return [];
    }
  },

  // Complete sale
  complete: async (id: number): Promise<Sale | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Sale>>(
        `/sales/${id}/complete`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to complete sale:', error);
      throw error;
    }
  },

  // Cancel sale
  cancel: async (id: number): Promise<boolean> => {
    try {
      await apiClient.post(`/sales/${id}/cancel`);
      return true;
    } catch (error) {
      console.error('Failed to cancel sale:', error);
      return false;
    }
  },
};