"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, TrendingUp, TrendingDown, Package } from "lucide-react"

// Données de démonstration
const movements = [
  {
    id: 1,
    date: "2025-01-24T14:30:00",
    type: "IN",
    productName: "Parfum Chanel N°5",
    quantity: 50,
    reference: "PO-2025-001",
    user: "Admin",
  },
  {
    id: 2,
    date: "2025-01-24T10:15:00",
    type: "OUT",
    productName: "Whisky Jack Daniel's",
    quantity: 5,
    reference: "SALE-2025-123",
    user: "Caissier1",
  },
  {
    id: 3,
    date: "2025-01-23T16:45:00",
    type: "IN",
    productName: "Chocolat Lindt",
    quantity: 100,
    reference: "PO-2025-002",
    user: "Admin",
  },
  {
    id: 4,
    date: "2025-01-23T11:20:00",
    type: "OUT",
    productName: "Champagne Moët",
    quantity: 3,
    reference: "SALE-2025-124",
    user: "Caissier2",
  },
  {
    id: 5,
    date: "2025-01-22T09:00:00",
    type: "ADJUSTMENT",
    productName: "Cigarettes Marlboro",
    quantity: -10,
    reference: "ADJ-2025-001",
    user: "Superviseur",
  },
]

export default function StockMovementsPage() {
  const router = useRouter()

  const stats = {
    in: movements.filter((m) => m.type === "IN").length,
    out: movements.filter((m) => m.type === "OUT").length,
    adjustments: movements.filter((m) => m.type === "ADJUSTMENT").length,
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "OUT":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-blue-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "IN":
        return <Badge className="bg-green-600">Entrée</Badge>
      case "OUT":
        return <Badge className="bg-red-600">Sortie</Badge>
      default:
        return <Badge className="bg-blue-600">Ajustement</Badge>
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
          <h1 className="text-3xl font-bold text-gray-900">Mouvements de stock</h1>
          <p className="text-gray-600">Historique des entrées et sorties</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entrées</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.in}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sorties</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.out}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ajustements</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adjustments}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Movements Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="text-center">Quantité</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Utilisateur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {new Date(movement.date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(movement.date).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(movement.type)}
                    {getTypeBadge(movement.type)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{movement.productName}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      movement.type === "IN"
                        ? "text-green-600 border-green-600"
                        : movement.type === "OUT"
                        ? "text-red-600 border-red-600"
                        : "text-blue-600 border-blue-600"
                    }
                  >
                    {movement.type === "IN" && "+"}
                    {movement.type === "OUT" && "-"}
                    {movement.quantity}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                <TableCell>{movement.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}