"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Calendar, Percent, Tag } from "lucide-react"
import { toast } from "sonner"

// Données de démonstration (en attendant le backend)
const demoPromotions = [
  {
    id: 1,
    code: "WELCOME10",
    name: "Bienvenue -10%",
    description: "10% de réduction pour les nouveaux clients",
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    active: true,
  },
  {
    id: 2,
    code: "SUMMER25",
    name: "Été 2025",
    description: "Promotion d'été",
    discountType: "FIXED_AMOUNT" as const,
    discountValue: 5000,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    active: true,
  },
]

export default function PromotionsPage() {
  const router = useRouter()
  const [promotions] = useState(demoPromotions)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isPromotionActive = (promo: typeof demoPromotions[0]) => {
    const now = new Date()
    const start = new Date(promo.startDate)
    const end = new Date(promo.endDate)
    return promo.active && now >= start && now <= end
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600">Gérez les promotions et remises</p>
        </div>
        <Button onClick={() => router.push("/dashboard/promotions/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <Percent className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(isPromotionActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">À venir</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expirées</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher une promotion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Promotions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPromotions.map((promo) => (
          <Card key={promo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{promo.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{promo.description}</p>
                </div>
                <Badge variant={isPromotionActive(promo) ? "default" : "secondary"}>
                  {isPromotionActive(promo) ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="font-mono font-bold text-blue-600">{promo.code}</span>
              </div>

              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {promo.discountType === "PERCENTAGE"
                      ? `${promo.discountValue}%`
                      : `${promo.discountValue.toLocaleString()} XOF`}
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    {promo.discountType === "PERCENTAGE" ? "de réduction" : "de remise fixe"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500">Début</p>
                  <p className="font-medium">
                    {new Date(promo.startDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Fin</p>
                  <p className="font-medium">
                    {new Date(promo.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                Modifier
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune promotion trouvée</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard/promotions/new")}>
              Créer une promotion
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}