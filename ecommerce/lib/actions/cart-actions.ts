"use server"

import { revalidatePath } from "next/cache"

export async function addToCart(bookId: number, quantity: number) {
  // TODO: Implement server action to add to cart
  // You might want to call your internal API here
  console.log(`Adding ${quantity} of book ${bookId} to cart (server action)`)

  revalidatePath("/")
  revalidatePath("/carrinho")

  return {
    message: `Adicionado ${quantity} do livro ${bookId} ao carrinho`,
  }
}
