"use client"

import { useState, useEffect } from "react"
import { BoardingPassScanner } from "@/components/pos/BoardingPassScanner"
import { productsApi, customersApi, salesApi, cashRegistersApi, loyaltyApi } from "@/lib/api"
import { useCartStore } from "@/lib/stores/cartStore"
import type { Product, Customer, CashRegister, LoyaltyCard } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, 
  Banknote, Gift, Tag, X, Wallet, Star, Plane 
} from "lucide-react"
import { toast } from "sonner"

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedCashRegister, setSelectedCashRegister] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "MOBILE_MONEY">("CASH")
  const [loading, setLoading] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [promotionCode, setPromotionCode] = useState("")
  const [useLoyaltyWallet, setUseLoyaltyWallet] = useState(false)

  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    loyaltyCard,
    setLoyaltyCard,
    promotionCode: appliedPromotion,
    applyPromotion,
    removePromotion,
    getSubtotal,
    getTotalDiscount,
    getTotalTax, 
    getGrandTotal,
    canUseLoyaltyWallet,
  } = useCartStore()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      loadLoyaltyCard(selectedCustomer.id)
    } else {
      setLoyaltyCard(null)
    }
  }, [selectedCustomer])

  const loadData = async () => {
    const [productsData, customersData, cashRegistersData] = await Promise.all([
      productsApi.getAll(),
      customersApi.getAll(),
      cashRegistersApi.getAll(),
    ])
    setProducts(productsData)
    setCustomers(customersData)
    setCashRegisters(cashRegistersData)
  }

  const loadLoyaltyCard = async (customerId: number) => {
    try {
      const card = await loyaltyApi.getByCustomer(customerId)
      setLoyaltyCard(card)
      if (card) {
        toast.success(`Carte fidélité ${card.tierLevel} activée`)
      }
    } catch (error) {
      setLoyaltyCard(null)
    }
  }

  const handleProductSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      let product = await productsApi.getByBarcode(searchQuery)
      if (!product) {
        product = await productsApi.getBySku(searchQuery)
      }

      if (product) {
        addItem(product)
        setSearchQuery("")
        toast.success(`${product.nameFr} ajouté au panier`)
      } else {
        toast.error("Produit non trouvé")
      }
    } catch (error) {
      toast.error("Erreur lors de la recherche")
    }
  }

  const handleApplyPromotion = () => {
    if (!promotionCode.trim()) return

    // Simulation de vérification de code promo
    // En production, faire un appel API
    if (promotionCode.toUpperCase() === "WELCOME10") {
      const discount = getSubtotal() * 0.1
      applyPromotion("WELCOME10", discount)
      toast.success("Code promo appliqué : -10%")
      setPromotionCode("")
    } else if (promotionCode.toUpperCase() === "SUMMER25") {
      applyPromotion("SUMMER25", 5000)
      toast.success("Code promo appliqué : -5,000 XOF")
      setPromotionCode("")
    } else {
      toast.error("Code promo invalide")
    }
  }

  const handleCompleteSale = async () => {
    if (items.length === 0) {
      toast.error("Le panier est vide")
      return
    }

    setLoading(true)

    try {
      let finalAmount = getGrandTotal()
      let walletAmountUsed = 0

      // Utiliser portefeuille fidélité si demandé
      if (useLoyaltyWallet && loyaltyCard && loyaltyCard.walletBalance > 0) {
        walletAmountUsed = Math.min(finalAmount, loyaltyCard.walletBalance)
        finalAmount -= walletAmountUsed
      }

      const saleData = {
        customerId: selectedCustomer?.id,
        cashRegisterId: selectedCashRegister,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        payments: finalAmount > 0 ? [
          {
            paymentMethod,
            amount: finalAmount,
            currency: "XOF" as const,
          },
        ] : [],
      }

      const sale = await salesApi.create(saleData)

      if (sale) {
        // Déduire du portefeuille si utilisé
        if (walletAmountUsed > 0 && loyaltyCard) {
          await loyaltyApi.deductFromWallet(loyaltyCard.cardNumber, walletAmountUsed)
        }

        // Ajouter des points (1 point par 100 XOF)
        if (loyaltyCard && loyaltyCard.active) {
          const pointsToAdd = Math.floor(getSubtotal() / 100)
          await loyaltyApi.addPoints(loyaltyCard.cardNumber, pointsToAdd)
          toast.success(`+${pointsToAdd} points ajoutés`)
        }

        toast.success(`Vente ${sale.saleNumber} enregistrée avec succès !`)
        clearCart()
        setSelectedCustomer(null)
        setUseLoyaltyWallet(false)
        setPaymentDialogOpen(false)
      } else {
        toast.error("Erreur lors de l'enregistrement de la vente")
      }
    } catch (error: unknown) {
      const isAxiosError = (err: unknown): err is { response?: { data?: { error?: string } } } => {
        return typeof err === 'object' && err !== null && 'response' in err
      }
      const errorMessage = isAxiosError(error) 
        ? error.response?.data?.error || "Erreur lors de la vente"
        : "Erreur lors de la vente"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "BRONZE": return "bg-amber-600"
      case "SILVER": return "bg-gray-400"
      case "GOLD": return "bg-yellow-600"
      case "PLATINUM": return "bg-slate-700"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: Products & Search */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Scanner code-barres ou rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleProductSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleProductSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(searchQuery ? filteredProducts.slice(0, 12) : products.slice(0, 12)).map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => {
                addItem(product)
                toast.success(`${product.nameFr} ajouté`)
              }}
            >
              <CardContent className="p-4">
                <div className="aspect-square mb-2 flex items-center justify-center bg-gray-100 rounded">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-sm truncate">{product.nameFr}</h3>
                <p className="text-xs text-gray-500">{product.sku}</p>
                <p className="font-bold text-blue-600 mt-2">
                  {product.sellingPriceXOF.toLocaleString()} XOF
                </p>
                {product.currentStock < product.minStockLevel && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    Stock faible
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Panier ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={selectedCustomer?.id.toString() || ""}
                onValueChange={(value) => {
                  const customer = customers.find((c) => c.id === parseInt(value))
                  setSelectedCustomer(customer || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.firstName} {customer.lastName}
                      {customer.isVip && " ⭐"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Boarding Pass Scanner */}
            <BoardingPassScanner
              onPassengerScanned={(passenger) => {
                toast.success(
                  `Vol ${passenger.flightNumber} vers ${passenger.destination} - Embarquement ${passenger.boardingTime}`
                )
                // Optionnel : créer automatiquement un client
                console.log("Passenger info:", passenger)
              }}
            />

            {/* Display passenger info if scanned */}
            {selectedCustomer && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Plane className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Informations passager</span>
                </div>
                <div className="text-xs space-y-1">
                  <p><strong>Nom:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                </div>
              </div>
            )}

            {/* Loyalty Card Info */}
            {loyaltyCard && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Carte Fidélité</span>
                  </div>
                  <Badge className={getTierColor(loyaltyCard.tierLevel)}>
                    {loyaltyCard.tierLevel}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Points</p>
                    <p className="font-bold text-blue-600">{loyaltyCard.points}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Portefeuille</p>
                    <p className="font-bold text-green-600">
                      {loyaltyCard.walletBalance.toLocaleString()} XOF
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Promotion Code */}
            {!appliedPromotion && (
              <div className="space-y-2">
                <Label>Code promo</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Entrer un code"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                  />
                  <Button onClick={handleApplyPromotion} size="icon" variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {appliedPromotion && (
              <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">{appliedPromotion}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={removePromotion}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Separator />

            {/* Cart Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Panier vide</p>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.nameFr}</p>
                      <p className="text-xs text-gray-500">
                        {item.unitPrice.toLocaleString()} XOF
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-600"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{getSubtotal().toLocaleString()} XOF</span>
              </div>
              {getTotalDiscount() > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Remises</span>
                  <span>-{getTotalDiscount().toLocaleString()} XOF</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>TVA</span>
                <span>{getTotalTax().toLocaleString()} XOF</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{getGrandTotal().toLocaleString()} XOF</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg" disabled={items.length === 0}>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Paiement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Loyalty Wallet Option */}
                    {canUseLoyaltyWallet() && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-purple-600" />
                            <span className="font-medium">Utiliser le portefeuille</span>
                          </div>
                          <input
                            type="checkbox"
                            id="use-loyalty-wallet"
                            checked={useLoyaltyWallet}
                            onChange={(e) => setUseLoyaltyWallet(e.target.checked)}
                            className="h-5 w-5"
                            aria-label="Utiliser le portefeuille fidélité"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          Disponible : {loyaltyCard?.walletBalance.toLocaleString()} XOF
                        </p>
                      </div>
                    )}

                    {/* Payment Methods */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={paymentMethod === "CASH" ? "default" : "outline"}
                        className="h-20 flex-col"
                        onClick={() => setPaymentMethod("CASH")}
                      >
                        <Banknote className="h-6 w-6 mb-1" />
                        <span className="text-xs">Espèces</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "CARD" ? "default" : "outline"}
                        className="h-20 flex-col"
                        onClick={() => setPaymentMethod("CARD")}
                      >
                        <CreditCard className="h-6 w-6 mb-1" />
                        <span className="text-xs">Carte</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "MOBILE_MONEY" ? "default" : "outline"}
                        className="h-20 flex-col"
                        onClick={() => setPaymentMethod("MOBILE_MONEY")}
                      >
                        <ShoppingCart className="h-6 w-6 mb-1" />
                        <span className="text-xs">Mobile</span>
                      </Button>
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-gray-50 rounded space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total à payer:</span>
                        <span className="font-bold">{getGrandTotal().toLocaleString()} XOF</span>
                      </div>
                      {useLoyaltyWallet && loyaltyCard && (
                        <>
                          <div className="flex justify-between text-sm text-purple-600">
                            <span>Portefeuille:</span>
                            <span>
                              -{Math.min(getGrandTotal(), loyaltyCard.walletBalance).toLocaleString()} XOF
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-lg">
                            <span>Reste à payer:</span>
                            <span>
                              {Math.max(
                                0,
                                getGrandTotal() - loyaltyCard.walletBalance
                              ).toLocaleString()}{" "}
                              XOF
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCompleteSale}
                      disabled={loading}
                    >
                      {loading ? "Traitement..." : "Confirmer le paiement"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
                disabled={items.length === 0}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}