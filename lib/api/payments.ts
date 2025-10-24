// lib/api/payments.ts
import apiClient, { type ApiResponse } from './client';
import type { Payment, CreatePaymentRequest } from '@/types/api';

export const paymentsApi = {
  // Get payments by sale
  getBySale: async (saleId: number): Promise<Payment[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Payment[]>>(
        `/payments/sale/${saleId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      return [];
    }
  },

  // Process payment
  processPayment: async (saleId: number, payment: CreatePaymentRequest): Promise<Payment | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>(
        `/payments/sale/${saleId}`,
        payment
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw error;
    }
  },

  // Get total paid
  getTotalPaid: async (saleId: number): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        `/payments/sale/${saleId}/total`
      );
      return response.data.data || 0;
    } catch (error) {
      console.error('Failed to get total paid:', error);
      return 0;
    }
  },

  // Verify payment
  verifyPayment: async (paymentId: number): Promise<boolean> => {
    try {
      await apiClient.post(`/payments/${paymentId}/verify`);
      return true;
    } catch (error) {
      console.error('Failed to verify payment:', error);
      return false;
    }
  },
};