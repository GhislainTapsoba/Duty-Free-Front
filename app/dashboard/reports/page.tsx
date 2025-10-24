"use client"

import { useEffect, useState } from "react"
import { reportsApi, salesApi } from "@/lib/api"
import type { SalesReportData, Sale } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, DollarSign, ShoppingCart, Receipt, 
  FileDown, Calendar, Users, Package 
} from "lucide-react"
import { toast } from "sonner"
import { exportSalesReport } from "@/lib/utils/exportExcel"

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])
  const [report, setReport] = useState<SalesReportData | null>(null)
  const [allSales, setAllSales] = useState<Sale[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "custom">("today")

  useEffect(() => {
    updateDatesForPeriod(selectedPeriod)
  }, [selectedPeriod])

  const updateDatesForPeriod = (period: typeof selectedPeriod) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (period) {
      case "today":
        start = today
        end = today
        break
      case "week":
        start = new Date(today.setDate(today.getDate() - 7))
        end = new Date()
        break
      case "month":
        start = new Date(today.setMonth(today.getMonth() - 1))
        end = new Date()
        break
      case "custom":
        return
    }

    setStartDate(start.toISOString().split("T")[0])
    setEndDate(end.toISOString().split("T")[0])

    loadReport()
  }

  const loadReport = async () => {
    try {
      setLoading(true)
      const [reportData, salesData] = await Promise.all([
        reportsApi.getSalesReport(startDate, endDate),
        salesApi.getAll()
      ])
      
      // Filtrer les ventes par période
      const filteredSales = salesData.filter((sale) => {
        const saleDate = new Date(sale.saleDate).toISOString().split("T")[0]
        return saleDate >= startDate && saleDate <= endDate
      })

      setReport(reportData)
      setAllSales(filteredSales)
    } catch (error) {
      toast.error("Erreur lors du chargement du rapport")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    loadReport()
  }

  const handleExportExcel = () => {
    if (!report || allSales.length === 0) {
      toast.error("Aucune donnée à exporter")
      return
    }

    try {
      exportSalesReport(allSales as unknown as Record<string, unknown>[], report as unknown as Record<string, unknown>, { startDate, endDate })
      toast.success("Rapport exporté avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'export")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600">Analysez vos performances de vente</p>
        </div>
        {report && (
          <Button onClick={handleExportExcel}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
        )}
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Période du rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as "today" | "week" | "month" | "custom")}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today">Aujourd&apos;hui</TabsTrigger>
              <TabsTrigger value="week">7 derniers jours</TabsTrigger>
              <TabsTrigger value="month">30 derniers jours</TabsTrigger>
              <TabsTrigger value="custom">Personnalisé</TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedPeriod === "custom" && (
            <div className="flex flex-wrap gap-4 items-end mt-4">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerateReport} disabled={loading}>
                {loading ? "Chargement..." : "Générer le rapport"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {report && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total des ventes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.salesCount}</div>
                <p className="text-xs text-muted-foreground">transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d&apos;affaires</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.totalRevenue.toLocaleString()} XOF
                </div>
                <p className="text-xs text-muted-foreground">total HT</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">TVA collectée</CardTitle>
                <Receipt className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.totalTax.toLocaleString()} XOF
                </div>
                <p className="text-xs text-muted-foreground">taxes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ticket moyen</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.salesCount > 0
                    ? Math.round(report.totalRevenue / report.salesCount).toLocaleString()
                    : 0}{" "}
                  XOF
                </div>
                <p className="text-xs text-muted-foreground">par vente</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition des paiements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Espèces</span>
                  <span className="font-medium">
                    {allSales.filter(s => s.payments?.some(p => p.paymentMethod === "CASH")).length} ventes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Carte bancaire</span>
                  <span className="font-medium">
                    {allSales.filter(s => s.payments?.some(p => p.paymentMethod === "CARD")).length} ventes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mobile Money</span>
                  <span className="font-medium">
                    {allSales.filter(s => s.payments?.some(p => p.paymentMethod === "MOBILE_MONEY")).length} ventes
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance journalière</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CA journalier moyen</span>
                  <span className="font-medium">
                    {report.salesCount > 0
                      ? Math.round(report.totalRevenue / Math.max(1, (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)).toLocaleString()
                      : 0}{" "}
                    XOF
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ventes/jour</span>
                  <span className="font-medium">
                    {report.salesCount > 0
                      ? Math.round(report.salesCount / Math.max(1, (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1))
                      : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Clients identifiés</span>
                  <span className="font-medium">
                    {allSales.filter(s => s.customerName).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Clients anonymes</span>
                  <span className="font-medium">
                    {allSales.filter(s => !s.customerName).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taux d&apos;identification</span>
                  <span className="font-medium">
                    {report.salesCount > 0
                      ? Math.round((allSales.filter(s => s.customerName).length / report.salesCount) * 100)
                      : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          {report.topProducts && report.topProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.topProducts.map((product, index) => (
                    <div key={product.productId} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-500">
                          {product.quantity} unités vendues
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {product.revenue.toLocaleString()} XOF
                        </p>
                        <p className="text-sm text-gray-500">
                          {report.totalRevenue > 0
                            ? Math.round((product.revenue / report.totalRevenue) * 100)
                            : 0}% du CA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* No Data */}
      {!report && !loading && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Sélectionnez une période et générez un rapport</p>
            <Button className="mt-4" onClick={loadReport}>
              Générer le rapport
            </Button>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card className="p-12">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        </Card>
      )}
    </div>
  )
}