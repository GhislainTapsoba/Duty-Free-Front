// lib/api/cash-registers.ts
import apiClient, { type ApiResponse } from './client';
import type { CashRegister } from '@/types/api';

export const cashRegistersApi = {
  // Get all cash registers
  getAll: async (): Promise<CashRegister[]> => {
    try {
      const response = await apiClient.get<ApiResponse<CashRegister[]>>('/cash-registers');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch cash registers:', error);
      return [];
    }
  },

  // Get by ID
  getById: async (id: number): Promise<CashRegister | null> => {
    try {
      const response = await apiClient.get<ApiResponse<CashRegister>>(
        `/cash-registers/${id}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch cash register:', error);
      return null;
    }
  },

  // Get by register number
  getByNumber: async (registerNumber: string): Promise<CashRegister | null> => {
    try {
      const response = await apiClient.get<ApiResponse<CashRegister>>(
        `/cash-registers/number/${registerNumber}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch cash register by number:', error);
      return null;
    }
  },

  // Get open cash registers
  getOpen: async (): Promise<CashRegister[]> => {
    try {
      const response = await apiClient.get<ApiResponse<CashRegister[]>>(
        '/cash-registers/open'
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch open cash registers:', error);
      return [];
    }
  },

  // Open cash register
  open: async (cashRegisterId: number, openingBalance: number): Promise<CashRegister | null> => {
    try {
      const response = await apiClient.post<ApiResponse<CashRegister>>(
        `/cash-registers/${cashRegisterId}/open`,
        null,
        { params: { openingBalance } }
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to open cash register:', error);
      throw error;
    }
  },

  // Close cash register
  close: async (cashRegisterId: number, closingBalance: number): Promise<CashRegister | null> => {
    try {
      const response = await apiClient.post<ApiResponse<CashRegister>>(
        `/cash-registers/${cashRegisterId}/close`,
        null,
        { params: { closingBalance } }
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to close cash register:', error);
      throw error;
    }
  },

  // Add cash
  addCash: async (cashRegisterId: number, amount: number, reason?: string): Promise<boolean> => {
    try {
      await apiClient.post(
        `/cash-registers/${cashRegisterId}/add-cash`,
        null,
        { params: { amount, reason } }
      );
      return true;
    } catch (error) {
      console.error('Failed to add cash:', error);
      return false;
    }
  },

  // Remove cash
  removeCash: async (cashRegisterId: number, amount: number, reason?: string): Promise<boolean> => {
    try {
      await apiClient.post(
        `/cash-registers/${cashRegisterId}/remove-cash`,
        null,
        { params: { amount, reason } }
      );
      return true;
    } catch (error) {
      console.error('Failed to remove cash:', error);
      return false;
    }
  },
};