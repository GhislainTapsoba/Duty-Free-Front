// lib/api/products.ts
import apiClient, { type ApiResponse } from './client';
import type { Product, CreateProductRequest } from '@/types/api';

export const productsApi = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  // Get product by ID
  getById: async (id: number): Promise<Product | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  },

  // Search products
  search: async (query: string): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products/search?q=${encodeURIComponent(query)}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  },

  // Get by barcode
  getByBarcode: async (barcode: string): Promise<Product | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/barcode/${barcode}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch product by barcode:', error);
      return null;
    }
  },

  // Get by SKU
  getBySku: async (sku: string): Promise<Product | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/sku/${sku}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch product by SKU:', error);
      return null;
    }
  },

  // Create product
  create: async (product: CreateProductRequest): Promise<Product | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        '/products',
        product
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id: number, product: Partial<CreateProductRequest>): Promise<Product | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(
        `/products/${id}`,
        product
      );
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  },

  // Get by category
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products/category/${categoryId}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      return [];
    }
  },

  // Get low stock products
  getLowStock: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/low-stock');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
      return [];
    }
  },

  // Get products needing reorder
  getReorderNeeded: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/reorder');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch reorder products:', error);
      return [];
    }
  },
};