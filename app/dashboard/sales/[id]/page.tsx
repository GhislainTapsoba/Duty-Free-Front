"use client"

import { useEffect, useState } from "react"
import { ReceiptPrinter } from "@/components/pos/ReceiptPrinter"
import { useRouter } from "next/navigation"
import { salesApi } from "@/lib/api"
import type { Sale } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Printer } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

export default function SaleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [sale, setSale] = useState<Sale | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSale()
  }, [])

  const loadSale = async () => {
    try {
      setLoading(true)
      const data = await salesApi.getById(parseInt(params.id))
      setSale(data)
    } catch (error) {
      toast.error("Erreur lors du chargement de la vente")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vente non trouvée</p>
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
        {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vente {sale.saleNumber}</h1>
            <p className="text-gray-600">{formatDate(sale.saleDate)}</p>
          </div>
        </div>
      </div>
        <Button>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Receipt Printer */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Ticket de Caisse</CardTitle>
            </CardHeader>
            <CardContent>
              <ReceiptPrinter sale={sale} />
            </CardContent>
          </Card>
        </div>
        
        {/* Sale Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-center">Qté</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.unitPrice.toLocaleString()} XOF
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.totalPrice.toLocaleString()} XOF
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sale.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{payment.paymentMethod}</p>
                      <p className="text-sm text-gray-600">{payment.currency}</p>
                    </div>
                    <p className="font-bold">{payment.amount.toLocaleString()} XOF</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Statut</p>
                <Badge
                  className={
                    sale.status === "COMPLETED"
                      ? "bg-green-600"
                      : sale.status === "PENDING"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }
                >
                  {sale.status === "COMPLETED"
                    ? "Complété"
                    : sale.status === "PENDING"
                    ? "En attente"
                    : "Annulé"}
                </Badge>
              </div>

              <Separator />

              {/* Customer */}
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium">{sale.customerName || "Client anonyme"}</p>
              </div>

              {/* Cashier */}
              <div>
                <p className="text-sm text-gray-600">Caissier</p>
                <p className="font-medium">{sale.cashierName}</p>
              </div>

              {/* Register */}
              <div>
                <p className="text-sm text-gray-600">Caisse</p>
                <p className="font-medium">{sale.cashRegisterNumber}</p>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sous-total</span>
                  <span className="font-medium">{sale.subtotal.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remise</span>
                  <span className="font-medium">{sale.discount.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">TVA</span>
                  <span className="font-medium">{sale.taxAmount.toLocaleString()} XOF</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{sale.totalAmount.toLocaleString()} XOF</span>
                </div>
              </div>

              {/* Notes */}
              {sale.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-sm">{sale.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}