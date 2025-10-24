"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { productsApi, categoriesApi } from "@/lib/api"
import type { Product, Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Save, Tag } from "lucide-react"

export default function NewPromotionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    active: true,
    applicableToAll: true,
    selectedCategories: [] as number[],
    selectedProducts: [] as number[],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [categoriesData, productsData] = await Promise.all([
      categoriesApi.getAll(),
      productsApi.getAll(),
    ])
    setCategories(categoriesData)
    setProducts(productsData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.code || !formData.name) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (formData.discountValue <= 0) {
      toast.error("La valeur de réduction doit être supérieure à 0")
      return
    }

    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      toast.error("Le pourcentage ne peut pas dépasser 100%")
      return
    }

    setLoading(true)

    try {
      // Simuler la création (backend API à implémenter)
      const promotionData = {
        ...formData,
        applicableCategories: formData.applicableToAll ? [] : formData.selectedCategories,
        applicableProducts: formData.applicableToAll ? [] : formData.selectedProducts,
      }

      // await promotionsApi.create(promotionData)
      
      toast.success("Promotion créée avec succès")
      router.push("/dashboard/promotions")
    } catch (error) {
      toast.error("Erreur lors de la création de la promotion")
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
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle promotion</h1>
          <p className="text-gray-600">Créez une promotion ou une remise</p>
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
                <Label htmlFor="code">Code promo *</Label>
                <Input
                  id="code"
                  placeholder="WELCOME10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
                <p className="text-xs text-gray-500">Le code que les clients utiliseront</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom de la promotion *</Label>
                <Input
                  id="name"
                  placeholder="Promotion de bienvenue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Détails de la promotion..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Label htmlFor="active">Promotion active</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuration de la réduction */}
          <Card>
            <CardHeader>
              <CardTitle>Réduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Type de réduction *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: string) => setFormData({ ...formData, discountType: value as typeof formData.discountType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Pourcentage (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Montant fixe (XOF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Valeur de la réduction *
                  {formData.discountType === "PERCENTAGE" && " (%)"}
                  {formData.discountType === "FIXED_AMOUNT" && " (XOF)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPurchaseAmount">Montant minimum d&apos;achat (XOF)</Label>
                <Input
                  id="minPurchaseAmount"
                  type="number"
                  min="0"
                  value={formData.minPurchaseAmount}
                  onChange={(e) => setFormData({ ...formData, minPurchaseAmount: parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-500">0 = pas de minimum</p>
              </div>

              {formData.discountType === "PERCENTAGE" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscountAmount">Réduction maximum (XOF)</Label>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    min="0"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500">0 = pas de limite</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Période de validité */}
          <Card>
            <CardHeader>
              <CardTitle>Période de validité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  required
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg mt-4">
                <p className="text-sm text-blue-900">
                  <strong>Durée :</strong>{" "}
                  {formData.startDate && formData.endDate
                    ? `${Math.ceil(
                        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )} jours`
                    : "Sélectionnez les dates"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Applicabilité */}
          <Card>
            <CardHeader>
              <CardTitle>Applicabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicableToAll">Appliquer à tous les produits</Label>
                <Switch
                  id="applicableToAll"
                  checked={formData.applicableToAll}
                  onCheckedChange={(checked) => setFormData({ ...formData, applicableToAll: checked })}
                />
              </div>

              {!formData.applicableToAll && (
                <>
                  <div className="space-y-2">
                    <Label>Catégories sélectionnées</Label>
                    <Select
                      onValueChange={(value) => {
                        const catId = parseInt(value)
                        if (!formData.selectedCategories.includes(catId)) {
                          setFormData({
                            ...formData,
                            selectedCategories: [...formData.selectedCategories, catId],
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ajouter une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.nameFr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedCategories.map((catId) => {
                        const category = categories.find((c) => c.id === catId)
                        return (
                          <div
                            key={catId}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            <span>{category?.nameFr}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  selectedCategories: formData.selectedCategories.filter((id) => id !== catId),
                                })
                              }
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Produits sélectionnés</Label>
                    <Select
                      onValueChange={(value) => {
                        const prodId = parseInt(value)
                        if (!formData.selectedProducts.includes(prodId)) {
                          setFormData({
                            ...formData,
                            selectedProducts: [...formData.selectedProducts, prodId],
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ajouter un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((prod) => (
                          <SelectItem key={prod.id} value={prod.id.toString()}>
                            {prod.nameFr} ({prod.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedProducts.map((prodId) => {
                        const product = products.find((p) => p.id === prodId)
                        return (
                          <div
                            key={prodId}
                            className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            <span>{product?.nameFr}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  selectedProducts: formData.selectedProducts.filter((id) => id !== prodId),
                                })
                              }
                              className="hover:text-green-900"
                            >
                              ×
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Aperçu de la promotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 border-2 border-dashed rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg mb-4">
                  <span className="font-bold text-2xl">{formData.code || "CODE"}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{formData.name || "Nom de la promotion"}</h3>
                <p className="text-gray-600 mb-4">{formData.description || "Description"}</p>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {formData.discountType === "PERCENTAGE"
                    ? `${formData.discountValue}% DE RÉDUCTION`
                    : `${formData.discountValue.toLocaleString()} XOF DE RÉDUCTION`}
                </div>
                {formData.minPurchaseAmount > 0 && (
                  <p className="text-sm text-gray-600">
                    Sur un achat minimum de {formData.minPurchaseAmount.toLocaleString()} XOF
                  </p>
                )}
                {formData.startDate && formData.endDate && (
                  <p className="text-sm text-gray-500 mt-4">
                    Valable du {new Date(formData.startDate).toLocaleDateString("fr-FR")} au{" "}
                    {new Date(formData.endDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer la promotion
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}