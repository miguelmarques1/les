"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  Package,
  RefreshCcw,
  CreditCard,
  Ticket,
  Users,
  Settings,
  ShoppingCart,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      name: "Painel",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Livros",
      path: "/dashboard/books",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Pedidos",
      path: "/dashboard/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Trocas & Devoluções",
      path: "/dashboard/returns",
      icon: <RefreshCcw className="h-5 w-5" />,
    },
    {
      name: "Bandeiras de Cartão",
      path: "/dashboard/card-brands",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Cupons",
      path: "/dashboard/coupons",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      path: "/dashboard/customers",
      icon: <Users className="h-5 w-5" />,
    },
  ]

  return (
    <div className="w-64 bg-purple-600 text-white flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b border-purple-500">
        <div className="h-12 w-12 rounded-full bg-purple-300 flex items-center justify-center text-purple-800 font-bold text-xl">
          AB
        </div>
        <div>
          <h1 className="font-bold">Analise</h1>
          <p className="text-xs text-purple-200">Bookstore Admin</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors",
                  pathname === route.path
                    ? "bg-white/20 text-white"
                    : "text-purple-200 hover:bg-white/10 hover:text-white",
                )}
              >
                {route.icon}
                <span>{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-purple-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-300 flex items-center justify-center">
              <span className="text-purple-800 font-bold">A</span>
            </div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-purple-200">admin@analise.com</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
