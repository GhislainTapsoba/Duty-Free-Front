import apiClient, { type ApiResponse } from './client'
import type { LoyaltyCard, CreateLoyaltyCardRequest } from '@/types/api'

export const loyaltyApi = {
  // Get card by number
  getByCardNumber: async (cardNumber: string): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.get<ApiResponse<LoyaltyCard>>(
        `/loyalty/${cardNumber}`
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to fetch loyalty card:', error)
      return null
    }
  },

  // Get by customer
  getByCustomer: async (customerId: number): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.get<ApiResponse<LoyaltyCard>>(
        `/loyalty/customer/${customerId}`
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to fetch customer loyalty card:', error)
      return null
    }
  },

  // Create card
  createCard: async (customerId: number, request?: CreateLoyaltyCardRequest): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.post<ApiResponse<LoyaltyCard>>(
        `/loyalty/customer/${customerId}`,
        request || {}
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to create loyalty card:', error)
      throw error
    }
  },

  // Add points
  addPoints: async (cardNumber: string, points: number): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.post<ApiResponse<LoyaltyCard>>(
        `/loyalty/${cardNumber}/points/add`,
        null,
        { params: { points } }
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to add points:', error)
      throw error
    }
  },

  // Redeem points
  redeemPoints: async (cardNumber: string, points: number): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.post<ApiResponse<LoyaltyCard>>(
        `/loyalty/${cardNumber}/points/redeem`,
        null,
        { params: { points } }
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to redeem points:', error)
      throw error
    }
  },

  // Add to wallet
  addToWallet: async (cardNumber: string, amount: number): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.post<ApiResponse<LoyaltyCard>>(
        `/loyalty/${cardNumber}/wallet/add`,
        null,
        { params: { amount } }
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to add to wallet:', error)
      throw error
    }
  },

  // Deduct from wallet
  deductFromWallet: async (cardNumber: string, amount: number): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.post<ApiResponse<LoyaltyCard>>(
        `/loyalty/${cardNumber}/wallet/deduct`,
        null,
        { params: { amount } }
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to deduct from wallet:', error)
      throw error
    }
  },

  // Get expiring cards
  getExpiringCards: async (daysAhead: number = 30): Promise<LoyaltyCard[]> => {
    try {
      const response = await apiClient.get<ApiResponse<LoyaltyCard[]>>(
        `/loyalty/expiring`,
        { params: { daysAhead } }
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch expiring cards:', error)
      return []
    }
  },

  // Renew card
  renewCard: async (cardNumber: string): Promise<LoyaltyCard | null> => {
    try {
      const response = await apiClient.post<ApiResponse<LoyaltyCard>>(
        `/loyalty/${cardNumber}/renew`
      )
      return response.data.data || null
    } catch (error) {
      console.error('Failed to renew card:', error)
      throw error
    }
  },

  // Deactivate card
  deactivateCard: async (cardNumber: string): Promise<boolean> => {
    try {
      await apiClient.post(`/loyalty/${cardNumber}/deactivate`)
      return true
    } catch (error) {
      console.error('Failed to deactivate card:', error)
      return false
    }
  },
}