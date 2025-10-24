// lib/api/reports.ts
import apiClient, { type ApiResponse } from './client';
import type { SalesReportData, StockReportData, DailySalesReport, CashierReport } from '@/types/api';

export interface CashRegisterReport {
  cashRegisterId: number;
  totalSales: number;
  totalRevenue: number;
  transactionCount: number;
  openingBalance: number;
  closingBalance: number;
}

export const reportsApi = {
  // Sales report
  getSalesReport: async (startDate: string, endDate: string): Promise<SalesReportData> => {
    try {
      const response = await apiClient.get<ApiResponse<SalesReportData>>(
        `/reports/sales?start=${startDate}&end=${endDate}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return {
        totalSales: 0,
        totalRevenue: 0,
        totalTax: 0,
        salesCount: 0,
      };
    } catch (error) {
      console.warn('Sales report endpoint not available, returning default data');
      return {
        totalSales: 0,
        totalRevenue: 0,
        totalTax: 0,
        salesCount: 0,
      };
    }
  },

  // Daily sales report
  getDailySalesReport: async (date: string): Promise<DailySalesReport | null> => {
    try {
      const response = await apiClient.get<ApiResponse<DailySalesReport>>(
        `/reports/sales/daily?date=${date}`
      );
      return response.data.data || null;
    } catch (error) {
      console.warn('Daily sales report endpoint not available');
      return null;
    }
  },

  // Cashier report
  getCashierReport: async (cashierId: number, startDate: string, endDate: string): Promise<CashierReport | null> => {
    try {
      const response = await apiClient.get<ApiResponse<CashierReport>>(
        `/reports/cashier/${cashierId}?start=${startDate}&end=${endDate}`
      );
      return response.data.data || null;
    } catch (error) {
      console.warn('Cashier report endpoint not available');
      return null;
    }
  },

  // Cash register report
  getCashRegisterReport: async (cashRegisterId: number, startDate: string, endDate: string): Promise<CashRegisterReport | null> => {
    try {
      const response = await apiClient.get<ApiResponse<CashRegisterReport>>(
        `/reports/cash-register/${cashRegisterId}?start=${startDate}&end=${endDate}`
      );
      return response.data.data || null;
    } catch (error) {
      console.warn('Cash register report endpoint not available');
      return null;
    }
  },

  // Stock report
  getStockReport: async (): Promise<StockReportData> => {
    try {
      const response = await apiClient.get<ApiResponse<StockReportData>>('/reports/stock');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return {
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalValue: 0,
      };
    } catch (error) {
      console.warn('Stock report endpoint not available, returning default data');
      return {
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalValue: 0,
      };
    }
  },
};