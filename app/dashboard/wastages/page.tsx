"use client"

import { useEffect, useState } from "react"
import { wastagesApi, productsApi } from "@/lib/api"
import type { Wastage, Product } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"

export default function WastagesPage() {
  const [wastages, setWastages] = useState<Wastage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [totalValueLost, setTotalValueLost] = useState(0)
  
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    wastageDate: new Date().toISOString().split("T")[0],
    reason: "DAMAGED" as const,
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [wastagesData, productsData] = await Promise.all([
        wastagesApi.getAll(),
        productsApi.getAll(),
      ])

      setWastages(wastagesData)
      setProducts(productsData)

      // Calculer valeur perdue ce mois
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      const total = await wastagesApi.getTotalValueLost(
        startOfMonth.toISOString().split("T")[0],
        new Date().toISOString().split("T")[0]
      )
      setTotalValueLost(total)
    } catch (error) {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await wastagesApi.create({
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        wastageDate: formData.wastageDate,
        reason: formData.reason,
        description: formData.description || undefined,
      })

      toast.success("Rebut enregistré avec succès")
      setDialogOpen(false)
      setFormData({
        productId: "",
        quantity: "",
        wastageDate: new Date().toISOString().split("T")[0],
        reason: "DAMAGED",
        description: "",
      })
      loadData()
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement")
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await wastagesApi.approve(id)
      toast.success("Rebut approuvé")
      loadData()
    } catch (error) {
      toast.error("Erreur lors de l'approbation")
    }
  }

  const getReasonLabel = (reason: string) => {
    const labels = {
      EXPIRED: "Expiré",
      DAMAGED: "Endommagé",
      THEFT: "Vol",
      OTHER: "Autre",
    }
    return labels[reason as keyof typeof labels] || reason
  }

  const getReasonColor = (reason: string) => {
    const colors = {
      EXPIRED: "bg-yellow-600",
      DAMAGED: "bg-orange-600",
      THEFT: "bg-red-600",
      OTHER: "bg-gray-600",
    }
    return colors[reason as keyof typeof colors] || "bg-gray-600"
  }

  const stats = {
    total: wastages.length,
    pending: wastages.filter(w => !w.approved).length,
    approved: wastages.filter(w => w.approved).length,
    thisMonth: totalValueLost,
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rebuts</h1>
          <p className="text-gray-600">Suivez les pertes et dommages</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Déclarer un rebut
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Déclarer un rebut</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Produit *</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.nameFr} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantité *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.wastageDate}
                  onChange={(e) => setFormData({ ...formData, wastageDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Raison *</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value: string) => setFormData({ ...formData, reason: value as typeof formData.reason })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAMAGED">Endommagé</SelectItem>
                    <SelectItem value="EXPIRED">Expiré</SelectItem>
                    <SelectItem value="THEFT">Vol</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détails supplémentaires..."
                />
              </div>

              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rebuts</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
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
            <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Perte ce mois</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.thisMonth / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">XOF</p>
          </CardContent>
        </Card>
      </div>

      {/* Wastages Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="text-center">Quantité</TableHead>
              <TableHead>Raison</TableHead>
              <TableHead className="text-right">Valeur Perdue</TableHead>
              <TableHead>Déclaré par</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wastages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Aucun rebut enregistré
                </TableCell>
              </TableRow>
            ) : (
              wastages.map((wastage) => (
                <TableRow key={wastage.id}>
                  <TableCell>
                    {new Date(wastage.wastageDate).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{wastage.productName}</p>
                      <p className="text-xs text-gray-500">{wastage.productSku}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive">{wastage.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getReasonColor(wastage.reason)}>
                      {getReasonLabel(wastage.reason)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {wastage.valueLost.toLocaleString()} XOF
                  </TableCell>
                  <TableCell>{wastage.reportedBy}</TableCell>
                  <TableCell className="text-center">
                   {wastage.approved ? (
                      <Badge className="bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approuvé
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-600">
                        <Clock className="mr-1 h-3 w-3" />
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!wastage.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(wastage.id)}
                      >
                        Approuver
                      </Button>
                    )}
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