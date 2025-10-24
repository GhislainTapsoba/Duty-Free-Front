import apiClient, { type ApiResponse } from './client'
import type { Wastage, CreateWastageRequest } from '@/types/api'

export const wastagesApi = {
  // Get all wastages
  getAll: async (): Promise<Wastage[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Wastage[]>>('/wastages')
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch wastages:', error)
      return []
    }
  },

  // Get by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Wastage[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Wastage[]>>(
        '/wastages/date-range',
        { params: { startDate, endDate } }
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch wastages:', error)
      return []
    }
  },

  // Get pending
  getPending: async (): Promise<Wastage[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Wastage[]>>('/wastages/pending')
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch pending wastages:', error)
      return []
    }
  },

  // Create wastage
  create: async (request: CreateWastageRequest): Promise<Wastage | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Wastage>>('/wastages', request)
      return response.data.data || null
    } catch (error) {
      console.error('Failed to create wastage:', error)
      throw error
    }
  },

  // Approve wastage
  approve: async (id: number): Promise<Wastage | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Wastage>>(`/wastages/${id}/approve`)
      return response.data.data || null
    } catch (error) {
      console.error('Failed to approve wastage:', error)
      throw error
    }
  },

  // Get total value lost
  getTotalValueLost: async (startDate: string, endDate: string): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        '/wastages/total-value-lost',
        { params: { startDate, endDate } }
      )
      return response.data.data || 0
    } catch (error) {
      console.error('Failed to get total value lost:', error)
      return 0
    }
  },
}