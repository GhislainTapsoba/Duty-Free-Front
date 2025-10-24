"use client"

import { useEffect, useState } from "react"
import { stockApi, productsApi } from "@/lib/api"
import type { Stock, Product } from "@/types/api"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertTriangle, Package } from "lucide-react"
import { toast } from "sonner"

export default function StockPage() {
  const [allStock, setAllStock] = useState<Stock[]>([])
  const [lowStock, setLowStock] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [stockData, lowStockData] = await Promise.all([
        productsApi.getAll(),
        stockApi.getLowStock(10),
      ])

      // Transform products to stock format
      const transformedStock: Stock[] = stockData.map((product) => ({
        id: product.id,
        productId: product.id,
        productName: product.nameFr,
        productSku: product.sku,
        sommierId: 1,
        availableQuantity: product.currentStock,
        reservedQuantity: 0,
        totalQuantity: product.currentStock,
        minStockLevel: product.minStockLevel,
        reorderLevel: product.reorderLevel,
      }))

      setAllStock(transformedStock)
      setLowStock(lowStockData)
    } catch (error) {
      toast.error("Erreur lors du chargement du stock")
    } finally {
      setLoading(false)
    }
  }

  const filteredStock = allStock.filter(
    (stock) =>
      stock.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.productSku.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Stock</h1>
          <p className="text-gray-600">Suivez et gérez vos niveaux de stock</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total produits</p>
              <p className="text-2xl font-bold">{allStock.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock faible</p>
              <p className="text-2xl font-bold">{lowStock.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Valeur totale</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous les produits</TabsTrigger>
          <TabsTrigger value="low">
            Stock faible
            {lowStock.length > 0 && (
              <Badge className="ml-2 bg-orange-600">{lowStock.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-center">Stock disponible</TableHead>
                  <TableHead className="text-center">Stock réservé</TableHead>
                  <TableHead className="text-center">Niveau min</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">{stock.productSku}</TableCell>
                      <TableCell>{stock.productName}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            (stock.minStockLevel && stock.availableQuantity <= stock.minStockLevel)
                              ? "destructive"
                              : "default"
                          }
                        >
                          {stock.availableQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{stock.reservedQuantity}</TableCell>
                      <TableCell className="text-center">{stock.minStockLevel || "-"}</TableCell>
                      <TableCell className="text-center">
                        {stock.minStockLevel && stock.availableQuantity <= stock.minStockLevel ? (
                          <Badge variant="destructive">Faible</Badge>
                        ) : (
                          <Badge className="bg-green-600">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="low">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-center">Stock disponible</TableHead>
                  <TableHead className="text-center">Niveau min</TableHead>
                  <TableHead className="text-center">À commander</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      Aucun produit avec stock faible
                    </TableCell>
                  </TableRow>
                ) : (
                  lowStock.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">{stock.productSku}</TableCell>
                      <TableCell>{stock.productName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">{stock.availableQuantity}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{stock.minStockLevel}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-600">
                          {(stock.reorderLevel || 0) - stock.availableQuantity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}