"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productsApi } from "@/lib/api"
import type { Product } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

interface OrderItem {
  productId: number
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  
  const [formData, setFormData] = useState({
    supplierName: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: "",
    notes: "",
  })

  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: "1",
    unitPrice: "",
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await productsApi.getAll()
    setProducts(data)
  }

  const handleAddItem = () => {
    if (!newItem.productId || !newItem.quantity || !newItem.unitPrice) {
      toast.error("Veuillez remplir tous les champs de l'article")
      return
    }

    const product = products.find((p) => p.id === parseInt(newItem.productId))
    if (!product) return

    const quantity = parseInt(newItem.quantity)
    const unitPrice = parseFloat(newItem.unitPrice)

    const item: OrderItem = {
      productId: product.id,
      productName: product.nameFr,
      productSku: product.sku,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    }

    setOrderItems([...orderItems, item])
    setNewItem({ productId: "", quantity: "1", unitPrice: "" })
    toast.success("Article ajouté")
  }

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (orderItems.length === 0) {
      toast.error("Ajoutez au moins un article à la commande")
      return
    }

    if (!formData.supplierName) {
      toast.error("Veuillez saisir le nom du fournisseur")
      return
    }

    setLoading(true)

    try {
      // Simuler la création (backend API à implémenter)
      const orderData = {
        ...formData,
        items: orderItems,
        totalAmount: calculateTotal(),
        status: "PENDING",
      }

      // await purchaseOrdersApi.create(orderData)
      
      toast.success("Commande créée avec succès")
      router.push("/dashboard/purchases/orders")
    } catch (error) {
      toast.error("Erreur lors de la création de la commande")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle commande fournisseur</h1>
          <p className="text-gray-600">Créez une commande d&apos;approvisionnement</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Fournisseur *</Label>
                  <Input
                    id="supplierName"
                    placeholder="Nom du fournisseur"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate">Date de commande *</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedDeliveryDate">Livraison prévue</Label>
                  <Input
                    id="expectedDeliveryDate"
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    min={formData.orderDate}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Informations supplémentaires..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Articles</span>
                  <span className="font-medium">{orderItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantité totale</span>
                  <span className="font-medium">
                    {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      {calculateTotal().toLocaleString()} XOF
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Item */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ajouter un article</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="productId">Produit</Label>
                <Select
                  value={newItem.productId}
                  onValueChange={(value) => {
                    const product = products.find((p) => p.id === parseInt(value))
                    setNewItem({
                      ...newItem,
                      productId: value,
                      unitPrice: product?.purchasePrice.toString() || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.nameFr} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Prix unitaire (XOF)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddItem}
              className="mt-4"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter l&apos;article
            </Button>
          </CardContent>
        </Card>

        {/* Items Table */}
        {orderItems.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Articles de la commande ({orderItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Quantité</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.productSku}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.unitPrice.toLocaleString()} XOF
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.totalPrice.toLocaleString()} XOF
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-bold">
                      Total de la commande
                    </TableCell>
                    <TableCell className="text-right font-bold text-xl text-blue-600">
                      {calculateTotal().toLocaleString()} XOF
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading || orderItems.length === 0}>
            {loading ? "Création..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer la commande
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}