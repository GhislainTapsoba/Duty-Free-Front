"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productsApi, categoriesApi } from "@/lib/api"
import type { Category, CreateProductRequest } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<CreateProductRequest>({
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
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const data = await categoriesApi.getAll()
    setCategories(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const product = await productsApi.create(formData)
      if (product) {
        toast.success("Produit créé avec succès")
        router.push("/dashboard/products")
      } else {
        toast.error("Erreur lors de la création")
      }
    } catch (error) {
      toast.error("Erreur lors de la création du produit")
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
          <h1 className="text-3xl font-bold text-gray-900">Nouveau produit</h1>
          <p className="text-gray-600">Ajoutez un nouveau produit au catalogue</p>
        </div>
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
                    <SelectValue placeholder="Sélectionner une catégorie" />
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
                  value={formData.barcode || ""}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
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
                  value={formData.sellingPriceEUR || 0}
                  onChange={(e) => setFormData({ ...formData, sellingPriceEUR: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPriceUSD">Prix de vente (USD)</Label>
                <Input
                  id="sellingPriceUSD"
                  type="number"
                  value={formData.sellingPriceUSD || 0}
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
              <div className="space-y-2">
                <Label htmlFor="minStockLevel">Niveau de stock minimum</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={formData.minStockLevel || 0}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Niveau de réapprovisionnement</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  value={formData.reorderLevel || 0}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unité</Label>
                <Input
                  id="unit"
                  value={formData.unit || "PIECE"}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
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
            {loading ? "Création..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer le produit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}