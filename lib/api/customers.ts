// lib/api/customers.ts
import apiClient, { type ApiResponse } from './client';
import type { Customer, CreateCustomerRequest } from '@/types/api';

export const customersApi = {
  // Get all customers
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Customer[]>>('/customers');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      return [];
    }
  },

  // Get by ID
  getById: async (id: number): Promise<Customer | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      return null;
    }
  },

  // Search
  search: async (query: string): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Customer[]>>(
        `/customers/search?q=${encodeURIComponent(query)}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to search customers:', error);
      return [];
    }
  },

  // Get by email
  getByEmail: async (email: string): Promise<Customer | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Customer>>(
        `/customers/email/${email}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch customer by email:', error);
      return null;
    }
  },

  // Get by phone
  getByPhone: async (phone: string): Promise<Customer | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Customer>>(
        `/customers/phone/${phone}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch customer by phone:', error);
      return null;
    }
  },

  // Get VIP customers
  getVip: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Customer[]>>('/customers/vip');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch VIP customers:', error);
      return [];
    }
  },

  // Create
  create: async (customer: CreateCustomerRequest): Promise<Customer | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Customer>>(
        '/customers',
        customer
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  },

  // Update
  update: async (id: number, customer: Partial<CreateCustomerRequest>): Promise<Customer | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Customer>>(
        `/customers/${id}`,
        customer
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  },

  // Delete
  delete: async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete customer:', error);
      return false;
    }
  },
};