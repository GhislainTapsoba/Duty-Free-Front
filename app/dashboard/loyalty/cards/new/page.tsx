"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loyaltyApi, customersApi } from "@/lib/api"
import type { Customer } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"

export default function NewLoyaltyCardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    searchParams.get("customerId") || ""
  )
  const [tierLevel, setTierLevel] = useState("BRONZE")
  const [expiryDate, setExpiryDate] = useState("")

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    const data = await customersApi.getAll()
    setCustomers(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomerId) {
      toast.error("Veuillez sélectionner un client")
      return
    }

    setLoading(true)

    try {
      const request = {
        customerId: parseInt(selectedCustomerId),
        tierLevel,
        expiryDate: expiryDate || undefined,
      }

      const card = await loyaltyApi.createCard(parseInt(selectedCustomerId), request)
      
      if (card) {
        toast.success("Carte de fidélité créée avec succès")
        router.push("/dashboard/loyalty/cards")
      } else {
        toast.error("Erreur lors de la création")
      }
    } catch (error: unknown) {
      const isAxiosError = (err: unknown): err is { response?: { data?: { error?: string } } } => {
        return typeof err === 'object' && err !== null && 'response' in err
      }
      const errorMessage = isAxiosError(error) 
        ? error.response?.data?.error || "Erreur lors de la création de la carte"
        : "Erreur lors de la création de la carte"
      toast.error(errorMessage)
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
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle Carte de Fidélité</h1>
          <p className="text-gray-600">Créez une carte de fidélité pour un client</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la carte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Client *</Label>
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.firstName} {customer.lastName}
                        {customer.email && ` (${customer.email})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tierLevel">Niveau de fidélité *</Label>
                <Select value={tierLevel} onValueChange={setTierLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRONZE">Bronze (0-1,999 points)</SelectItem>
                    <SelectItem value="SILVER">Silver (2,000-4,999 points)</SelectItem>
                    <SelectItem value="GOLD">Gold (5,000-9,999 points)</SelectItem>
                    <SelectItem value="PLATINUM">Platinum (10,000+ points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d&apos;expiration (optionnel)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-gray-500">
                  Par défaut : 2 ans à partir d&apos;aujourd&apos;hui
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>À propos du programme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• 1 point = 100 XOF dépensés</li>
                  <li>• 100 points = 1,000 XOF de crédit</li>
                  <li>• Portefeuille électronique utilisable immédiatement</li>
                  <li>• Avantages selon le niveau</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Niveaux de fidélité</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-600"></div>
                    <span className="text-sm">Bronze : Avantages de base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Silver : 5% de remise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                    <span className="text-sm">Gold : 10% de remise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-700"></div>
                    <span className="text-sm">Platinum : 15% + VIP</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Note :</strong> Le numéro de carte sera généré automatiquement lors de
                  la création.
                </p>
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
                Créer la carte
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}