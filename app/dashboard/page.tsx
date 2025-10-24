"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reportsApi, stockApi, salesApi, productsApi } from "@/lib/api"
import { TrendingUp, ShoppingCart, Package, AlertTriangle, DollarSign, Users } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todaySales: 0,
    todayRevenue: 0,
    lowStockItems: 0,
    totalProducts: 0,
    weekRevenue: [] as number[],
    topCategories: [] as { name: string; value: number }[],
    salesByPayment: { cash: 0, card: 0, mobile: 0 },
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]
      
      // Calculer la semaine dernière
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weekAgoStr = weekAgo.toISOString().split("T")[0]

      const [salesReport, stockData, allProducts, allSales] = await Promise.allSettled([
        reportsApi.getSalesReport(today, today),
        stockApi.getLowStock(),
        productsApi.getAll(),
        salesApi.getAll(),
      ])

      const salesReportData = salesReport.status === "fulfilled" 
        ? salesReport.value 
        : { salesCount: 0, totalRevenue: 0, totalTax: 0, totalSales: 0 }

      const stockDataResult = stockData.status === "fulfilled" ? stockData.value : []
      const productsData = allProducts.status === "fulfilled" ? allProducts.value : []
      const salesData = allSales.status === "fulfilled" ? allSales.value : []

      // Calculer revenus par jour (7 derniers jours)
      const last7Days = []
      const revenueByDay = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        last7Days.push(date.toLocaleDateString('fr-FR', { weekday: 'short' }))
        
        const dayRevenue = salesData
          .filter(s => s.saleDate.split("T")[0] === dateStr)
          .reduce((sum, s) => sum + s.totalAmount, 0)
        revenueByDay.push(dayRevenue)
      }

      // Calculer ventes par mode de paiement
      const paymentStats = {
        cash: salesData.filter(s => s.payments?.some(p => p.paymentMethod === "CASH")).length,
        card: salesData.filter(s => s.payments?.some(p => p.paymentMethod === "CARD")).length,
        mobile: salesData.filter(s => s.payments?.some(p => p.paymentMethod === "MOBILE_MONEY")).length,
      }

      // Top catégories (simulé)
      const categoryStats = [
        { name: "Parfums", value: 35 },
        { name: "Alcools", value: 28 },
        { name: "Tabac", value: 20 },
        { name: "Confiseries", value: 17 },
      ]

      setStats({
        todaySales: salesReportData.salesCount || 0,
        todayRevenue: salesReportData.totalRevenue || 0,
        lowStockItems: stockDataResult.length || 0,
        totalProducts: productsData.length || 0,
        weekRevenue: revenueByDay,
        topCategories: categoryStats,
        salesByPayment: paymentStats,
      })

    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Ventes du jour",
      value: stats.todaySales,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "CA du jour",
      value: `${(stats.todayRevenue / 1000).toFixed(0)}K`,
      subValue: "XOF",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Stock faible",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Produits actifs",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  // Données pour le graphique de revenus
  const revenueChartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Chiffre d\'affaires (XOF)',
        data: stats.weekRevenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: { parsed: { y: number | null } }) {
            const value = tooltipItem.parsed.y
            return value !== null ? value.toLocaleString() + ' XOF' : '0 XOF'
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value
            return (numValue / 1000).toFixed(0) + 'K'
          }
        }
      }
    }
  }

  // Données pour le graphique de paiements
  const paymentChartData = {
    labels: ['Espèces', 'Carte', 'Mobile Money'],
    datasets: [
      {
        data: [
          stats.salesByPayment.cash,
          stats.salesByPayment.card,
          stats.salesByPayment.mobile,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  // Données pour le graphique des catégories
  const categoriesChartData = {
    labels: stats.topCategories.map(c => c.name),
    datasets: [
      {
        label: 'Part de marché (%)',
        data: stats.topCategories.map(c => c.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
      },
    ],
  }

  const categoriesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: number | string) {
            return value + '%'
          }
        }
      }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                {stat.subValue && <span className="text-sm ml-1 text-gray-500">{stat.subValue}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Chiffre d&apos;affaires - 7 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={revenueChartData} options={revenueChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Répartition des paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Doughnut data={paymentChartData} options={paymentChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Top Catégories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={categoriesChartData} options={categoriesChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouvelle vente</p>
                  <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                </div>
                <span className="text-sm font-bold text-blue-600">+15,000 XOF</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Stock mis à jour</p>
                  <p className="text-xs text-gray-500">Il y a 12 minutes</p>
                </div>
                <span className="text-sm font-bold text-green-600">+50 produits</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alerte stock faible</p>
                  <p className="text-xs text-gray-500">Il y a 1 heure</p>
                </div>
                <span className="text-sm font-bold text-orange-600">{stats.lowStockItems} produits</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveau client fidélité</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
                <span className="text-sm font-bold text-purple-600">+1 carte</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Nouvelle vente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Ouvrir le point de vente pour enregistrer une nouvelle transaction</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Gérer le stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Consulter et ajuster les niveaux de stock</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Voir les rapports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Analyser les performances et générer des rapports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}