"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/hooks/use-cart"
import { useBooks } from "@/lib/hooks/use-books"
import { useCoupon } from "@/lib/hooks/use-coupon"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import BookCard from "@/components/book-card"
import { addToCart } from "@/lib/actions/cart-actions"

export default function CartPage() {
  const { cart, groupedItems, isLoading: isCartLoading, error: cartError, removeFromCart, refreshCart } = useCart()
  const { books } = useBooks()
  const { coupon, isLoading: isCouponLoading, error: couponError, validateCoupon, clearCoupon } = useCoupon()
  const { toast } = useToast()

  const [couponCode, setCouponCode] = useState("")
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  // Recommended books (in a real app, this would come from the API)
  const recommendedBooks = books.slice(0, 4)

  // Calculate subtotal
  const subtotal = cart?.total || 0

  // Shipping cost
  const shippingCost = cart?.freightValue || 0

  // Coupon discount
  const couponDiscount = coupon ? coupon.calculateDiscountAmount(subtotal) : 0

  const total = subtotal + shippingCost - couponDiscount

  const updateQuantity = async (bookId: number, currentQuantity: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const book = groupedItems.find((book) => book.bookId === bookId);

      if (!book) {
        throw new Error("Livro não encontrado no carrinho");
      }

      if (newQuantity < currentQuantity) {
        const quantityToRemove = currentQuantity - newQuantity;
        const cartItemIds = book.stockItems
          .slice(-quantityToRemove)
          .map(item => item.cartItemId ?? 0);

        await removeFromCart(cartItemIds);
      }
      else if (newQuantity > currentQuantity) {
        const quantityToAdd = newQuantity - currentQuantity;
        await addToCart(bookId, quantityToAdd);
      }

      toast({
        title: "Quantidade atualizada",
        description: `A quantidade foi atualizada para ${newQuantity}.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade.",
        variant: "destructive",
      });
    }
  }

  const removeBook = async (bookId: number, quantity: number) => {
    try {
      const book = groupedItems.find((book) => book.bookId === bookId);

      if (!book) {
        throw new Error("Livro não encontrado no carrinho");
      }
      const cartItemIds = book.stockItems.slice(0, quantity).map(item => item.cartItemId ?? 0);

      await removeFromCart(cartItemIds);
      toast({
        title: "Item removido",
        description: "O item foi removido do carrinho.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      })
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Código vazio",
        description: "Por favor, informe um código de cupom.",
        variant: "destructive",
      })
      return
    }

    try {
      const validCoupon = await validateCoupon(couponCode)

      if (validCoupon) {
        toast({
          title: "Cupom aplicado",
          description: `Cupom ${validCoupon.code} aplicado com sucesso!`,
        })
        setCouponCode("")
      }
    } catch (error) {
      toast({
        title: "Cupom inválido",
        description: "O código de cupom informado não é válido ou está expirado.",
        variant: "destructive",
      })
    }
  }

  // Remove coupon
  const removeCoupon = () => {
    clearCoupon()
    toast({
      title: "Cupom removido",
      description: "O cupom foi removido do carrinho.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Carrinho de Compras</h1>

          {cartError && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{cartError}</div>}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Itens do Carrinho</h2>

                {isCartLoading ? (
                  <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-32 w-24 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <div className="flex justify-between">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : groupedItems.length > 0 ? (
                  <div className="space-y-6">
                    {groupedItems.map((item) => (
                      <div key={item.bookId} className="flex gap-4 pb-6 border-b last:border-0">
                        <div className="flex-shrink-0">
                          <div className="relative h-32 w-24 bg-gray-100 rounded-md overflow-hidden">
                            <Link href={`/livro/${item.bookId}`}>
                              <Image
                                src={
                                  item.coverImage ||
                                  `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(item.title)}`
                                }
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <Link href={`/livro/${item.bookId}`} className="hover:underline">
                            <h3 className="font-medium">{item.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-2">{item.author}</p>

                          <div className="flex justify-between items-end mt-4">
                            <div className="flex items-center border rounded-md">
                              <button
                                className="px-3 py-1 border-r hover:bg-gray-100"
                                onClick={() => updateQuantity(item.bookId, item.quantity, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(item.bookId, item.quantity, Number.parseInt(e.target.value) || 1)
                                }
                                className="w-12 text-center text-sm py-1"
                              />
                              <button
                                className="px-3 py-1 border-l hover:bg-gray-100"
                                onClick={() => updateQuantity(item.bookId, item.quantity, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <p className="font-medium">R${(item.unitPrice * item.quantity).toFixed(2)}</p>
                              <button
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => removeBook(item.bookId, item.quantity)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-6">Seu carrinho está vazio.</p>
                    <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Link href="/">Continuar Comprando</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>R${shippingCost.toFixed(2)}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between items-center text-green-600">
                      <div className="flex items-center">
                        <span>Cupom: {coupon.code}</span>
                        <button className="ml-2 text-gray-400 hover:text-red-500" onClick={removeCoupon}>
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <span>-R${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>R${total.toFixed(2)}</span>
                </div>

                {/* Coupon Input */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código do cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isCouponLoading || !!coupon}
                    />
                    <Button variant="outline" onClick={applyCoupon} disabled={isCouponLoading || !!coupon}>
                      {isCouponLoading ? "Aplicando..." : "Aplicar"}
                    </Button>
                  </div>
                  {couponError && <p className="text-sm text-red-600 mt-1">{couponError}</p>}
                </div>

                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={isCartLoading || groupedItems.length === 0}
                  asChild
                >
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          {recommendedBooks.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Você também pode gostar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
