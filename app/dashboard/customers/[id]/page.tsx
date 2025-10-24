"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { customersApi, loyaltyApi } from "@/lib/api"
import type { Customer, LoyaltyCard } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, Save, Trash2, CreditCard, Star } from "lucide-react"

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    nationality: "",
    isVip: false,
    active: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoadingData(true)
      const customerData = await customersApi.getById(parseInt(params.id))

      if (customerData) {
        setCustomer(customerData)
        setFormData({
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email || "",
          phone: customerData.phone || "",
          passportNumber: customerData.passportNumber || "",
          nationality: customerData.nationality || "",
          isVip: customerData.isVip,
          active: customerData.active,
        })

        // Charger carte fidélité
        try {
          const card = await loyaltyApi.getByCustomer(customerData.id)
          setLoyaltyCard(card)
        } catch (error) {
          // Pas de carte
        }
      }
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
      const updated = await customersApi.update(parseInt(params.id), formData)
      if (updated) {
        toast.success("Client mis à jour avec succès")
        router.push("/dashboard/customers")
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du client")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return

    try {
      const success = await customersApi.delete(parseInt(params.id))
      if (success) {
        toast.success("Client supprimé avec succès")
        router.push("/dashboard/customers")
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du client")
    }
  }

  const handleCreateLoyaltyCard = async () => {
    try {
      const card = await loyaltyApi.createCard(parseInt(params.id))
      if (card) {
        toast.success("Carte de fidélité créée")
        setLoyaltyCard(card)
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la carte")
    }
  }

  if (loadingData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Client non trouvé</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Modifier le client</h1>
            <p className="text-gray-600">
              {customer.firstName} {customer.lastName}
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations du client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">Numéro de passeport</Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <Label htmlFor="isVip">Client VIP</Label>
                  </div>
                  <Switch
                    id="isVip"
                    checked={formData.isVip}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVip: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Client actif</Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                </div>
              </CardContent>
            </Card>

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

        {/* Loyalty Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Carte de fidélité
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loyaltyCard ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                    <p className="text-xs opacity-80 mb-1">N° Carte</p>
                    <p className="font-mono text-sm mb-4">{loyaltyCard.cardNumber}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-80">Niveau</p>
                        <p className="font-bold">{loyaltyCard.tierLevel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-80">Points</p>
                        <p className="text-2xl font-bold">{loyaltyCard.points}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Portefeuille</span>
                      <span className="font-bold">{loyaltyCard.walletBalance.toLocaleString()} XOF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expiration</span>
                      <span>{new Date(loyaltyCard.expiryDate).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Statut</span>
                      <Badge variant={loyaltyCard.active ? "default" : "secondary"}>
                        {loyaltyCard.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/loyalty/cards")}
                  >
                    Gérer la carte
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500 mb-4">Aucune carte de fidélité</p>
                  <Button onClick={handleCreateLoyaltyCard} className="w-full">
                    Créer une carte
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}