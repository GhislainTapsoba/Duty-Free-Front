"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Package, AlertTriangle, Gift, TrendingDown, type LucideIcon } from "lucide-react"
import { stockApi, loyaltyApi } from "@/lib/api"

interface Notification {
  id: string
  type: "stock" | "loyalty" | "wastage" | "sommier"
  title: string
  message: string
  timestamp: Date
  icon: LucideIcon
  color: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = useCallback(async () => {
    const newNotifications: Notification[] = []

    try {
      // Vérifier stock faible
      const lowStock = await stockApi.getLowStock(10)
      if (lowStock.length > 0) {
        newNotifications.push({
          id: "stock-low",
          type: "stock",
          title: "Stock faible",
          message: `${lowStock.length} produit(s) en stock faible`,
          timestamp: new Date(),
          icon: Package,
          color: "text-orange-600",
        })
      }

      // Vérifier cartes fidélité expirantes
      const expiringCards = await loyaltyApi.getExpiringCards(30)
      if (expiringCards.length > 0) {
        newNotifications.push({
          id: "loyalty-expiring",
          type: "loyalty",
          title: "Cartes expirantes",
          message: `${expiringCards.length} carte(s) expire(nt) dans 30 jours`,
          timestamp: new Date(),
          icon: Gift,
          color: "text-purple-600",
        })
      }

      // Simulation : Alerte sommier
      newNotifications.push({
        id: "sommier-alert",
        type: "sommier",
        title: "Sommier à apurer",
        message: "Sommier S-2025-001 doit être apuré sous 7 jours",
        timestamp: new Date(),
        icon: AlertTriangle,
        color: "text-red-600",
      })

      setNotifications(newNotifications)
      setUnreadCount(newNotifications.length)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadNotifications()
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(loadNotifications, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [loadNotifications])

  const handleMarkAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs"
                  onClick={handleMarkAsRead}
                >
                  Marquer comme lu
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className={`mt-0.5 ${notif.color}`}>
                    <notif.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notif.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}