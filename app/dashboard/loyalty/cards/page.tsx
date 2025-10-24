"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loyaltyApi, customersApi } from "@/lib/api"
import type { LoyaltyCard, Customer } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, CreditCard, Gift, Wallet, RotateCcw } from "lucide-react"
import { toast } from "sonner"

export default function LoyaltyCardsPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loyaltyCards, setLoyaltyCards] = useState<Map<number, LoyaltyCard>>(new Map())
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null)
  const [pointsToAdd, setPointsToAdd] = useState("")
  const [pointsToRedeem, setPointsToRedeem] = useState("")
  const [amountToAdd, setAmountToAdd] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const customersData = await customersApi.getAll()
      setCustomers(customersData)

      // Charger les cartes de fidélité pour chaque client
      const cardsMap = new Map<number, LoyaltyCard>()
      for (const customer of customersData) {
        const card = await loyaltyApi.getByCustomer(customer.id)
        if (card) {
          cardsMap.set(customer.id, card)
        }
      }
      setLoyaltyCards(cardsMap)
    } catch (error) {
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPoints = async () => {
    if (!selectedCard || !pointsToAdd) return

    try {
      await loyaltyApi.addPoints(selectedCard.cardNumber, parseInt(pointsToAdd))
      toast.success(`${pointsToAdd} points ajoutés avec succès`)
      setPointsToAdd("")
      setDialogOpen(false)
      loadData()
    } catch (error) {
      toast.error("Erreur lors de l'ajout des points")
    }
  }

  const handleRedeemPoints = async () => {
    if (!selectedCard || !pointsToRedeem) return

    try {
      await loyaltyApi.redeemPoints(selectedCard.cardNumber, parseInt(pointsToRedeem))
      toast.success(`${pointsToRedeem} points échangés avec succès`)
      setPointsToRedeem("")
      setDialogOpen(false)
      loadData()
    } catch (error) {
      toast.error("Erreur lors de l'échange des points")
    }
  }

  const handleAddToWallet = async () => {
    if (!selectedCard || !amountToAdd) return

    try {
      await loyaltyApi.addToWallet(selectedCard.cardNumber, parseFloat(amountToAdd))
      toast.success(`${amountToAdd} XOF ajouté au portefeuille`)
      setAmountToAdd("")
      setDialogOpen(false)
      loadData()
    } catch (error) {
      toast.error("Erreur lors de l'ajout au portefeuille")
    }
  }

  const getTierBadge = (tier: string) => {
    const colors = {
      BRONZE: "bg-amber-600",
      SILVER: "bg-gray-400",
      GOLD: "bg-yellow-600",
      PLATINUM: "bg-slate-700",
    }
    return <Badge className={colors[tier as keyof typeof colors] || ""}>{tier}</Badge>
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cartes de Fidélité</h1>
          <p className="text-gray-600">Gérez les cartes de fidélité de vos clients</p>
        </div>
        <Button onClick={() => router.push("/dashboard/loyalty/cards/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle carte
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Cards Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>N° Carte</TableHead>
              <TableHead className="text-center">Niveau</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Portefeuille</TableHead>
              <TableHead className="text-center">Expiration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => {
                const card = loyaltyCards.get(customer.id)
                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>
                      {card ? (
                        <span className="font-mono text-sm">{card.cardNumber}</span>
                      ) : (
                        <Badge variant="secondary">Pas de carte</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {card ? getTierBadge(card.tierLevel) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {card ? (
                        <span className="font-bold text-blue-600">{card.points.toLocaleString()}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {card ? (
                        <span className="font-bold text-green-600">
                          {card.walletBalance.toLocaleString()} XOF
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {card ? new Date(card.expiryDate).toLocaleDateString("fr-FR") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {card ? (
                        <Dialog open={dialogOpen && selectedCard?.id === card.id} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCard(card)}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Gérer la carte</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Card Info */}
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium">{card.customerName}</p>
                                <p className="text-sm text-gray-600">{card.cardNumber}</p>
                                <div className="mt-2 flex gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500">Points</p>
                                    <p className="font-bold">{card.points}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Portefeuille</p>
                                    <p className="font-bold">{card.walletBalance.toLocaleString()} XOF</p>
                                  </div>
                                </div>
                              </div>

                              {/* Add Points */}
                              <div className="space-y-2">
                                <Label>Ajouter des points</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Nombre de points"
                                    value={pointsToAdd}
                                    onChange={(e) => setPointsToAdd(e.target.value)}
                                  />
                                  <Button onClick={handleAddPoints}>
                                    <Gift className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Redeem Points */}
                              <div className="space-y-2">
                                <Label>Échanger des points</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Points à échanger"
                                    value={pointsToRedeem}
                                    onChange={(e) => setPointsToRedeem(e.target.value)}
                                  />
                                  <Button onClick={handleRedeemPoints} variant="secondary">
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500">100 points = 1,000 XOF</p>
                              </div>

                              {/* Add to Wallet */}
                              <div className="space-y-2">
                                <Label>Créditer le portefeuille</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Montant (XOF)"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                  />
                                  <Button onClick={handleAddToWallet} variant="outline">
                                    <Wallet className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/loyalty/cards/new?customerId=${customer.id}`)}
                        >
                          Créer carte
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}