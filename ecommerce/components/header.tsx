"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/contexts/cart-context"
import { useAuth } from "@/lib/contexts/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { cart } = useCart()
  const { isAuthenticated, isLoading: isAuthLoading, user, logout } = useAuth()

  // Calculate total items in cart
  const cartItemCount = cart?.items?.length || 0

  const categories = [
    "Literatura",
    "Ficção",
    "Não-Ficção",
    "Infantil",
    "Negócios",
    "Autoajuda",
    "Biografia",
    "História",
    "Mais...",
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-amber-700 font-bold text-xl">
            Livraria XYZ
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar livros, autores ou categorias..."
                className="w-full pr-10 border-amber-200 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full text-amber-500 hover:text-amber-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-amber-700">
                  Categorias
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category}>
                    <Link href={`/categoria/${category.toLowerCase()}`} className="w-full">
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/lancamentos">
              <Button variant="ghost" className="text-amber-700">
                Lançamentos
              </Button>
            </Link>

            <Link href="/promocoes">
              <Button variant="ghost" className="text-amber-700">
                Promoções
              </Button>
            </Link>

            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-amber-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {!isAuthLoading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isAuthenticated ? (
                      <User className="h-5 w-5 text-amber-700" />
                    ) : (
                      <LogIn className="h-5 w-5 text-amber-700" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium">{user?.name || "Usuário"}</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/conta" className="w-full">
                          Minha Conta
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/conta" className="w-full">
                          Meus Pedidos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        Sair
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem>
                        <Link href="/login" className="w-full">
                          Entrar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/cadastro" className="w-full">
                          Criar Conta
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-amber-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5 text-amber-700" /> : <Menu className="h-5 w-5 text-amber-700" />}
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Buscar..."
              className="w-full pr-10 border-amber-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full text-amber-500">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 bg-white border-t pt-2">
            <nav className="flex flex-col space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start text-amber-700">
                    Categorias
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category}>
                      <Link href={`/categoria/${category.toLowerCase()}`} className="w-full">
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/lancamentos" className="py-2 px-4 hover:bg-amber-50 rounded-md">
                Lançamentos
              </Link>
              <Link href="/promocoes" className="py-2 px-4 hover:bg-amber-50 rounded-md">
                Promoções
              </Link>

              {/* Mobile User Menu */}
              {!isAuthLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-t">
                        {user?.name || "Usuário"}
                      </div>
                      <Link href="/conta" className="py-2 px-4 hover:bg-amber-50 rounded-md">
                        Minha Conta
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="py-2 px-4 hover:bg-red-50 rounded-md text-red-600 text-left w-full"
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="py-2 px-4 hover:bg-amber-50 rounded-md border-t">
                        Entrar
                      </Link>
                      <Link href="/cadastro" className="py-2 px-4 hover:bg-amber-50 rounded-md">
                        Criar Conta
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
