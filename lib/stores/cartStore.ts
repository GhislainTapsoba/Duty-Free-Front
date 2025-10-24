import { create } from "zustand"
import type { Product, LoyaltyCard } from "@/types/api"

interface CartItem {
  product: Product
  quantity: number
  unitPrice: number
  subtotal: number
  discount?: number
}

interface CartState {
  items: CartItem[]
  customerId: number | null
  loyaltyCard: LoyaltyCard | null
  promotionCode: string | null
  promotionDiscount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  setCustomer: (customerId: number | null) => void
  setLoyaltyCard: (card: LoyaltyCard | null) => void
  applyPromotion: (code: string, discount: number) => void
  removePromotion: () => void
  getSubtotal: () => number
  getTotalDiscount: () => number
  getTotalTax: () => number
  getGrandTotal: () => number
  canUseLoyaltyWallet: () => boolean
  useLoyaltyWallet: (amount: number) => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customerId: null,
  loyaltyCard: null,
  promotionCode: null,
  promotionDiscount: 0,

  addItem: (product, quantity = 1) => {
    const items = get().items
    const existingItem = items.find((item) => item.product.id === product.id)

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        ),
      })
    } else {
      set({
        items: [
          ...items,
          {
            product,
            quantity,
            unitPrice: product.sellingPriceXOF,
            subtotal: product.sellingPriceXOF * quantity,
            discount: 0,
          },
        ],
      })
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.product.id !== productId) })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }

    set({
      items: get().items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice,
            }
          : item
      ),
    })
  },

  clearCart: () => {
    set({ 
      items: [], 
      customerId: null, 
      loyaltyCard: null,
      promotionCode: null,
      promotionDiscount: 0,
    })
  },

  setCustomer: (customerId) => {
    set({ customerId })
  },

  setLoyaltyCard: (card) => {
    set({ loyaltyCard: card })
  },

  applyPromotion: (code, discount) => {
    set({ promotionCode: code, promotionDiscount: discount })
  },

  removePromotion: () => {
    set({ promotionCode: null, promotionDiscount: 0 })
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.subtotal, 0)
  },

  getTotalDiscount: () => {
    const subtotal = get().getSubtotal()
    const promoDiscount = get().promotionDiscount
    const loyaltyCard = get().loyaltyCard
    
    let totalDiscount = promoDiscount

    // Appliquer remise selon niveau fidélité
    if (loyaltyCard && loyaltyCard.active) {
      let loyaltyDiscountPercent = 0
      
      switch (loyaltyCard.tierLevel) {
        case "SILVER":
          loyaltyDiscountPercent = 5
          break
        case "GOLD":
          loyaltyDiscountPercent = 10
          break
        case "PLATINUM":
          loyaltyDiscountPercent = 15
          break
      }

      totalDiscount += (subtotal * loyaltyDiscountPercent) / 100
    }

    return totalDiscount
  },

  getTotalTax: () => {
    const subtotal = get().getSubtotal()
    const discount = get().getTotalDiscount()
    const taxableAmount = subtotal - discount

    return get().items.reduce((sum, item) => {
      const itemTaxableAmount = (item.subtotal / subtotal) * taxableAmount
      return sum + (itemTaxableAmount * item.product.taxRate) / 100
    }, 0)
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal()
    const discount = get().getTotalDiscount()
    const tax = get().getTotalTax()
    
    return subtotal - discount + tax
  },

  canUseLoyaltyWallet: () => {
    const card = get().loyaltyCard
    return card !== null && card.active && card.walletBalance > 0
  },

  useLoyaltyWallet: (amount) => {
    const card = get().loyaltyCard
    if (!card || !card.active) return 0

    const maxUsable = Math.min(amount, card.walletBalance)
    return maxUsable
  },
}))