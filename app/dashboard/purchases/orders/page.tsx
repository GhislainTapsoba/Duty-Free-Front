"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Package, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

// Données de démonstration
const demoPurchaseOrders = [
  {
    id: 1,
    orderNumber: "PO-2025-001",
    supplierName: "Fournisseur Global",
    orderDate: "2025-01-15",
    expectedDeliveryDate: "2025-01-30",
    status: "PENDING",
    totalAmount: 2500000,
    items: 15,
  },
  {
    id: 2,
    orderNumber: "PO-2025-002",
    supplierName: "Import Express",
    orderDate: "2025-01-10",
    expectedDeliveryDate: "2025-01-25",
    status: "CONFIRMED",
    totalAmount: 1800000,
    items: 10,
  },
]

export default function PurchaseOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState(demoPurchaseOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-600">En attente</Badge>
      case "CONFIRMED":
        return <Badge className="bg-blue-600">Confirmée</Badge>
      case "RECEIVED":
        return <Badge className="bg-green-600">Reçue</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    confirmed: orders.filter(o => o.status === "CONFIRMED").length,
    received: orders.filter(o => o.status === "RECEIVED").length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes Fournisseurs</h1>
          <p className="text-gray-600">Gérez vos commandes d&apos;approvisionnement</p>
        </div>
        <Button onClick={() => router.push("/dashboard/purchases/orders/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle commande
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">commandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reçues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.received}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {(stats.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">XOF</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher une commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Livraison prévue</TableHead>
              <TableHead className="text-center">Articles</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {new Date(order.expectedDeliveryDate).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{order.items}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {order.totalAmount.toLocaleString()} XOF
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}