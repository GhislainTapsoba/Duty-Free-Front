// lib/api/purchase-orders.ts
import apiClient, { type ApiResponse } from './client';

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  expectedDeliveryDate?: string;
  totalAmount: number;
}

export const purchaseOrdersApi = {
  // Get all
  getAll: async (): Promise<PurchaseOrder[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>('/purchase-orders');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
      return [];
    }
  },

  // Get by ID
  getById: async (id: number): Promise<PurchaseOrder | null> => {
    try {
      const response = await apiClient.get<ApiResponse<PurchaseOrder>>(
        `/purchase-orders/${id}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch purchase order:', error);
      return null;
    }
  },

  // Get by status
  getByStatus: async (status: string): Promise<PurchaseOrder[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>(
        `/purchase-orders/status/${status}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch purchase orders by status:', error);
      return [];
    }
  },

  // Get by supplier
  getBySupplier: async (supplierId: number): Promise<PurchaseOrder[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>(
        `/purchase-orders/supplier/${supplierId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch purchase orders by supplier:', error);
      return [];
    }
  },

  // Get overdue
  getOverdue: async (): Promise<PurchaseOrder[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>(
        '/purchase-orders/overdue'
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch overdue orders:', error);
      return [];
    }
  },

  // Create
  create: async (order: CreatePurchaseOrderRequest): Promise<PurchaseOrder | null> => {
    try {
      const response = await apiClient.post<ApiResponse<PurchaseOrder>>(
        '/purchase-orders',
        order
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create purchase order:', error);
      throw error;
    }
  },

  // Confirm
  confirm: async (id: number): Promise<boolean> => {
    try {
      await apiClient.post(`/purchase-orders/${id}/confirm`);
      return true;
    } catch (error) {
      console.error('Failed to confirm order:', error);
      return false;
    }
  },

  // Receive
  receive: async (id: number): Promise<boolean> => {
    try {
      await apiClient.post(`/purchase-orders/${id}/receive`);
      return true;
    } catch (error) {
      console.error('Failed to receive order:', error);
      return false;
    }
  },

  // Cancel
  cancel: async (id: number): Promise<boolean> => {
    try {
      await apiClient.post(`/purchase-orders/${id}/cancel`);
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  },
};