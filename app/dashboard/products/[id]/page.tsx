"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productsApi, categoriesApi } from "@/lib/api"
import type { Category, Product } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    sku: "",
    nameFr: "",
    nameEn: "",
    categoryId: 0,
    purchasePrice: 0,
    sellingPriceXOF: 0,
    sellingPriceEUR: 0,
    sellingPriceUSD: 0,
    taxRate: 18,
    active: true,
    trackStock: true,
    minStockLevel: 10,
    reorderLevel: 5,
    unit: "PIECE",
    barcode: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoadingData(true)
      const [productData, categoriesData] = await Promise.all([
        productsApi.getById(parseInt(params.id)),
        categoriesApi.getAll(),
      ])

      if (productData) {
        setProduct(productData)
        setFormData({
          sku: productData.sku,
          nameFr: productData.nameFr,
          nameEn: productData.nameEn,
          categoryId: productData.categoryId,
          purchasePrice: productData.purchasePrice,
          sellingPriceXOF: productData.sellingPriceXOF,
          sellingPriceEUR: productData.sellingPriceEUR || 0,
          sellingPriceUSD: productData.sellingPriceUSD || 0,
          taxRate: productData.taxRate,
          active: productData.active,
          trackStock: productData.trackStock,
          minStockLevel: productData.minStockLevel || 10,
          reorderLevel: productData.reorderLevel || 5,
          unit: productData.unit || "PIECE",
          barcode: productData.barcode || "",
        })
      }
      setCategories(categoriesData)
    } catch (error) {
      toast.error("Erreur lors du chargement")
      router.back()
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updated = await productsApi.update(parseInt(params.id), formData)
      if (updated) {
        toast.success("Produit mis à jour avec succès")
        router.push("/dashboard/products")
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du produit")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return

    try {
      const success = await productsApi.delete(parseInt(params.id))
      if (success) {
        toast.success("Produit supprimé avec succès")
        router.push("/dashboard/products")
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit")
    }
  }

  if (loadingData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Produit non trouvé</p>
        <Button onClick={() => router.back()} className="mt-4">
          Retour
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier le produit</h1>
            <p className="text-gray-600">{product.nameFr}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameFr">Nom (Français) *</Label>
                <Input
                  id="nameFr"
                  value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn">Nom (Anglais) *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nameFr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Code-barres</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">Produit actif</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prix */}
          <Card>
            <CardHeader>
              <CardTitle>Prix et Taxes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Prix d&apos;achat (XOF) *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPriceXOF">Prix de vente (XOF) *</Label>
                <Input
                  id="sellingPriceXOF"
                  type="number"
                  value={formData.sellingPriceXOF}
                  onChange={(e) => setFormData({ ...formData, sellingPriceXOF: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPriceEUR">Prix de vente (EUR)</Label>
                <Input
                  id="sellingPriceEUR"
                  type="number"
                  value={formData.sellingPriceEUR}
                  onChange={(e) => setFormData({ ...formData, sellingPriceEUR: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPriceUSD">Prix de vente (USD)</Label>
                <Input
                  id="sellingPriceUSD"
                  type="number"
                  value={formData.sellingPriceUSD}
                  onChange={(e) => setFormData({ ...formData, sellingPriceUSD: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Taux de TVA (%) *</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion du stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="trackStock">Suivre le stock</Label>
                <Switch
                  id="trackStock"
                  checked={formData.trackStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, trackStock: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Niveau de stock minimum</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Niveau de réapprovisionnement</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unité</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Info Stock Actuel */}
          <Card>
            <CardHeader>
              <CardTitle>Informations stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-sm text-gray-600">Stock actuel</span>
                <span className="text-xl font-bold text-blue-600">{product.currentStock}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm text-gray-600">Valeur stock</span>
                <span className="text-xl font-bold text-green-600">
                  {(product.currentStock * product.purchasePrice).toLocaleString()} XOF
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-4">
                <p>Créé le : {product.createdAt ? new Date(product.createdAt).toLocaleDateString("fr-FR") : "N/A"}</p>
                <p>Modifié le : {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("fr-FR") : "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Mise à jour..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Mettre à jour
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}