"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Gift, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoyaltyPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Programme de Fidélité</h1>
        <p className="text-gray-600">Gérez les cartes de fidélité et les avantages clients</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={() => router.push("/dashboard/loyalty/cards")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cartes Actives</CardTitle>
            <CreditCard className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Voir toutes les cartes</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          onClick={() => router.push("/dashboard/loyalty/cards/new")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nouvelle Carte</CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-2">Créer une carte</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Points Distribués</CardTitle>
            <Gift className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Portefeuille Total</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">- XOF</div>
            <p className="text-xs text-muted-foreground">Solde cumulé</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Niveaux de Fidélité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-amber-50 to-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-amber-600"></div>
                <h3 className="font-bold text-amber-900">BRONZE</h3>
              </div>
              <p className="text-sm text-amber-800">0 - 1,999 points</p>
              <p className="text-xs text-amber-700 mt-2">Avantages de base</p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                <h3 className="font-bold text-gray-900">SILVER</h3>
              </div>
              <p className="text-sm text-gray-800">2,000 - 4,999 points</p>
              <p className="text-xs text-gray-700 mt-2">5% de remise</p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                <h3 className="font-bold text-yellow-900">GOLD</h3>
              </div>
              <p className="text-sm text-yellow-800">5,000 - 9,999 points</p>
              <p className="text-xs text-yellow-700 mt-2">10% de remise</p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                <h3 className="font-bold">PLATINUM</h3>
              </div>
              <p className="text-sm">10,000+ points</p>
              <p className="text-xs mt-2">15% de remise + avantages VIP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Créer une carte</h3>
              <p className="text-sm text-gray-600">
                Créez une carte de fidélité pour chaque client régulier
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <span className="font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Accumuler des points</h3>
              <p className="text-sm text-gray-600">
                1 point pour chaque 100 XOF dépensé. Points ajoutés automatiquement
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <span className="font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Utiliser les avantages</h3>
              <p className="text-sm text-gray-600">
                Échanger des points ou utiliser le portefeuille électronique
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}