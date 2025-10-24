// lib/api/sommiers.ts
import apiClient, { type ApiResponse } from './client';

export interface Sommier {
  id: number;
  sommierNumber: string;
  openingDate: string;
  closingDate?: string;
  initialValue: number;
  currentValue: number;
  clearedValue: number;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
}

export interface CreateSommierRequest {
  sommierNumber: string;
  initialValue: number;
}

export const sommiersApi = {
  // Get active sommiers
  getActive: async (): Promise<Sommier[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Sommier[]>>('/sommiers/active');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch active sommiers:', error);
      return [];
    }
  },

  // Get by ID
  getById: async (id: number): Promise<Sommier | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Sommier>>(`/sommiers/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch sommier:', error);
      return null;
    }
  },

  // Get by status
  getByStatus: async (status: string): Promise<Sommier[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Sommier[]>>(
        `/sommiers/status/${status}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch sommiers by status:', error);
      return [];
    }
  },

  // Create
  create: async (sommier: CreateSommierRequest): Promise<Sommier | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Sommier>>('/sommiers', sommier);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create sommier:', error);
      throw error;
    }
  },

  // Close
  close: async (sommierId: number): Promise<boolean> => {
    try {
      await apiClient.post(`/sommiers/${sommierId}/close`);
      return true;
    } catch (error) {
      console.error('Failed to close sommier:', error);
      return false;
    }
  },

  // Update value
  updateValue: async (sommierId: number, newValue: number): Promise<boolean> => {
    try {
      await apiClient.put(`/sommiers/${sommierId}/update-value`, null, {
        params: { newValue }
      });
      return true;
    } catch (error) {
      console.error('Failed to update sommier value:', error);
      return false;
    }
  },
};