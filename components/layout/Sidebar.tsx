"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  BarChart3,
  Warehouse,
  LogOut,
  Gift,
  Tag,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Point de Vente", href: "/dashboard/pos", icon: ShoppingCart },
  { name: "Produits", href: "/dashboard/products", icon: Package },
  { name: "Catégories", href: "/dashboard/categories", icon: Tag },
  { name: "Clients", href: "/dashboard/customers", icon: Users },
  { name: "Ventes", href: "/dashboard/sales", icon: TrendingUp },
  { name: "Achats", href: "/dashboard/purchases/orders", icon: ShoppingBag },
  { name: "Stock", href: "/dashboard/stock", icon: Warehouse },
  { name: "Rebuts", href: "/dashboard/wastages", icon: Trash2 },
  { name: "Rapports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Fidélité", href: "/dashboard/loyalty", icon: Gift },
  { name: "Promotions", href: "/dashboard/promotions", icon: Tag },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-6">
        <ShoppingCart className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold">Duty Free</span>
      </div>

      {/* User Info */}
      <div className="px-4 py-4">
        <div className="rounded-lg bg-gray-800 p-3">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-gray-800" />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}