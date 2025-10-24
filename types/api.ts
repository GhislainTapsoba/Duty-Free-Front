// types/api.ts
// API request/response types for Duty Free Management System

// ============================================
// AUTHENTICATION & USER
// ============================================

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  userId: number
  username: string
  fullName: string
  role: "ADMIN" | "SUPERVISEUR" | "CAISSIER" | "STOCK_MANAGER"
  cashRegisterId?: number
}

export interface User {
  id: number
  username: string
  fullName: string
  email: string
  role: string
  active: boolean
  cashRegisterId?: number
}

// ============================================
// PRODUCTS
// ============================================

export interface Product {
  id: number
  sku: string
  nameFr: string
  nameEn: string
  descriptionFr?: string
  descriptionEn?: string
  barcode?: string
  categoryId: number
  categoryName: string
  supplierId?: number
  supplierName?: string
  purchasePrice: number
  sellingPriceXOF: number
  sellingPriceEUR: number
  sellingPriceUSD: number
  taxRate: number
  imageUrl?: string
  active: boolean
  trackStock: boolean
  currentStock: number
  minStockLevel: number
  reorderLevel: number
  unit: string
  createdAt: string
  updatedAt?: string
}

export interface CreateProductRequest {
  sku: string
  nameFr: string
  nameEn: string
  descriptionFr?: string
  descriptionEn?: string
  barcode?: string
  categoryId: number
  supplierId?: number
  purchasePrice: number
  sellingPriceXOF: number
  sellingPriceEUR?: number
  sellingPriceUSD?: number
  taxRate: number
  imageUrl?: string
  active?: boolean
  trackStock?: boolean
  minStockLevel?: number
  reorderLevel?: number
  unit?: string
}

// ============================================
// CATEGORIES
// ============================================

export interface Category {
  id: number
  code: string
  nameFr: string
  nameEn: string
  descriptionFr?: string
  descriptionEn?: string
  parentId?: number
  active: boolean
}

// ============================================
// SUPPLIERS
// ============================================

export interface Supplier {
  id: number
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  active: boolean
}

// ============================================
// CUSTOMERS
// ============================================

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email?: string
  phone?: string
  passportNumber?: string
  nationality?: string
  dateOfBirth?: string
  isVip: boolean
  active: boolean
  createdAt: string
}

export interface CreateCustomerRequest {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  passportNumber?: string
  nationality?: string
  dateOfBirth?: string
  isVip?: boolean
}

// ============================================
// SALES
// ============================================

export interface Sale {
  id: number
  saleNumber: string
  saleDate: string
  cashierName: string
  customerName?: string
  cashRegisterNumber: string
  status: "PENDING" | "COMPLETED" | "CANCELLED"
  subtotal: number
  discount: number
  taxAmount: number
  totalAmount: number
  items: SaleItem[]
  payments: Payment[]
  receiptNumber?: string
  passengerName?: string
  flightNumber?: string
  airline?: string
  destination?: string
  notes?: string
}

export interface SaleItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
  taxAmount: number
  totalPrice: number
}

export interface Payment {
  id: number
  paymentMethod: "CASH" | "CARD" | "MOBILE_MONEY" | "MIXED"
  amount: number
  currency: "XOF" | "EUR" | "USD"
  transactionReference?: string
}

export interface CreateSaleRequest {
  customerId?: number
  cashRegisterId: number
  items: CreateSaleItemRequest[]
  payments: CreatePaymentRequest[]
  notes?: string
}

export interface CreateSaleItemRequest {
  productId: number
  quantity: number
  unitPrice: number
  discount?: number
}

export interface CreatePaymentRequest {
  paymentMethod: "CASH" | "CARD" | "MOBILE_MONEY" | "MIXED"
  amount: number
  currency: "XOF" | "EUR" | "USD"
  transactionReference?: string
}

// ============================================
// STOCK
// ============================================

export interface Stock {
  id: number
  productId: number
  productName: string
  productSku: string
  sommierId: number
  availableQuantity: number
  reservedQuantity: number
  totalQuantity: number
  location?: string
  lotNumber?: string
  expiryDate?: string
  minStockLevel?: number
  reorderLevel?: number
}

export interface CreateStockRequest {
  productId: number
  sommierId?: number
  quantity: number
  location?: string
  lotNumber?: string
  expiryDate?: string
}

// ============================================
// CASH REGISTERS
// ============================================

export interface CashRegister {
  id: number
  registerNumber: string
  name: string
  location?: string
  active: boolean
  isOpen: boolean
  openedAt?: string
  closedAt?: string
  openingBalance: number
  closingBalance: number
  expectedBalance: number
  cashInDrawer: number
}

// ============================================
// REPORTS
// ============================================

export interface SalesReportData {
  totalSales: number
  totalRevenue: number
  totalTax: number
  salesCount: number
  averageTicket?: number
  topProducts?: Array<{
    productId: number
    productName: string
    quantity: number
    revenue: number
  }>
}

export interface StockReportData {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  totalStockValue?: number
  lowStockItems?: number
  outOfStockItems?: number
}

export interface DailySalesReport {
  date: string
  salesCount: number
  totalRevenue: number
  totalTax: number
  averageTicket: number
}

export interface CashierReport {
  cashierId: number
  cashierName: string
  salesCount: number
  totalRevenue: number
  startDate: string
  endDate: string
}

// ============================================
// COMMON/UTILITY TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  timestamp: string
  error?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ErrorResponse {
  success: false
  error: string
  timestamp: string
  message?: string
}

// ============================================
// ENUMS
// ============================================

export type PaymentMethod = "CASH" | "CARD" | "MOBILE_MONEY" | "MIXED"
export type Currency = "XOF" | "EUR" | "USD"
export type SaleStatus = "PENDING" | "COMPLETED" | "CANCELLED"
export type UserRole = "ADMIN" | "SUPERVISEUR" | "CAISSIER" | "STOCK_MANAGER"

// ==================== LOYALTY CARDS ====================
export interface LoyaltyCard {
  id: number
  cardNumber: string
  customerId: number
  customerName: string
  points: number
  walletBalance: number
  tierLevel: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
  expiryDate: string
  active: boolean
  lastUsedDate: string
}

export interface CreateLoyaltyCardRequest {
  customerId: number
  tierLevel?: string
  expiryDate?: string
}

// ==================== PROMOTIONS ====================
export interface Promotion {
  id: number
  code: string
  name: string
  description: string
  discountType: "PERCENTAGE" | "FIXED_AMOUNT"
  discountValue: number
  startDate: string
  endDate: string
  active: boolean
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  applicableCategories?: number[]
  applicableProducts?: number[]
}

export interface CreatePromotionRequest {
  code: string
  name: string
  description: string
  discountType: "PERCENTAGE" | "FIXED_AMOUNT"
  discountValue: number
  startDate: string
  endDate: string
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  applicableCategories?: number[]
  applicableProducts?: number[]
}

// ==================== HOSTED CLIENT DISCOUNTS ====================
export interface HostedClientDiscount {
  id: number
  badgeNumber: string
  clientName: string
  discountPercentage: number
  validFrom: string
  validUntil: string
  active: boolean
}

// ==================== WASTAGES ====================
export interface Wastage {
  id: number
  productId: number
  productName: string
  productSku: string
  quantity: number
  wastageDate: string
  reason: "EXPIRED" | "DAMAGED" | "THEFT" | "OTHER"
  description?: string
  reportedBy: string
  valueLost: number
  approved: boolean
  approvedBy?: string
  approvalDate?: string
}

export interface CreateWastageRequest {
  productId: number
  quantity: number
  wastageDate: string
  reason: "EXPIRED" | "DAMAGED" | "THEFT" | "OTHER"
  description?: string
}