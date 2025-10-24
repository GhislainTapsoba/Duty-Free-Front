"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { salesApi } from "@/lib/api"
import type { Sale } from "@/types/api"
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
import { Search, Eye, FileText } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

export default function SalesPage() {
  const router = useRouter()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    try {
      setLoading(true)
      const data = await salesApi.getAll()
      setSales(data)
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes")
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(
    (sale) =>
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.cashierName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-600">Complété</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-600">En attente</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Annulé</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Ventes</h1>
          <p className="text-gray-600">Historique de toutes les ventes</p>
        </div>
        <Button onClick={() => router.push("/dashboard/pos")}>
          <FileText className="mr-2 h-4 w-4" />
          Nouvelle vente
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher une vente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Sales Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Vente</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Caissier</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Aucune vente trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.saleNumber}</TableCell>
                  <TableCell>{formatDate(sale.saleDate)}</TableCell>
                  <TableCell>{sale.customerName || "Client anonyme"}</TableCell>
                  <TableCell>{sale.cashierName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {sale.totalAmount.toLocaleString()} XOF
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(sale.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/dashboard/sales/${sale.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total des ventes</div>
          <div className="text-2xl font-bold">{sales.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Chiffre d&apos;affaires total</div>
          <div className="text-2xl font-bold">
            {sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString()} XOF
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Ticket moyen</div>
          <div className="text-2xl font-bold">
            {sales.length > 0
              ? Math.round(
                  sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length
                ).toLocaleString()
              : 0}{" "}
            XOF
          </div>
        </Card>
      </div>
    </div>
  )
}