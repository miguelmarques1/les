import { test, expect } from "@playwright/test"
import {
  setupAuth, // Added setupAuth import
  waitForTableToLoad,
  navigateToOrdersPage,
  updateOrderStatus,
  verifyOrderStatus,
  getFirstOrderWithStatus,
} from "../helpers/test-helpers"

/**
 * Fluxo de Status de Pedidos
 *
 * Ordem válida de transições:
 * PROCESSING -> APPROVED | REJECTED | CANCELED
 * APPROVED -> SHIPPING | CANCELED
 * SHIPPING -> SHIPPED
 * SHIPPED -> DELIVERED
 *
 * Status finais (sem transições): REJECTED, CANCELED, DELIVERED
 */
test.describe("Fluxo de Status de Pedidos", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto("/")
  })

  test.describe("Fluxo completo: PROCESSING -> APPROVED -> SHIPPING -> SHIPPED -> DELIVERED", () => {
    test("Administrador define pedido como EM PREPARAÇÃO (SHIPPING)", async ({ page }) => {
      await navigateToOrdersPage(page)

      // Busca um pedido com status APPROVED
      const orderId = await getFirstOrderWithStatus(page, "Aprovado")

      if (!orderId) {
        test.skip()
        return
      }

      // Atualiza para SHIPPING (Em preparação)
      await updateOrderStatus(page, orderId, "Shipping")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyOrderStatus(page, orderId, "Shipping")
      expect(statusUpdated).toBeTruthy()
    })

    test("Administrador define pedido como EM TRANSPORTE (SHIPPED)", async ({ page }) => {
      await navigateToOrdersPage(page)

      // Busca um pedido com status SHIPPING
      const orderId = await getFirstOrderWithStatus(page, "Em preparação")

      if (!orderId) {
        test.skip()
        return
      }

      // Atualiza para SHIPPED (Em transporte)
      await updateOrderStatus(page, orderId, "Shipped")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyOrderStatus(page, orderId, "Shipped")
      expect(statusUpdated).toBeTruthy()
    })

    test("Administrador confirma que o pedido foi ENTREGUE (DELIVERED)", async ({ page }) => {
      await navigateToOrdersPage(page)

      // Busca um pedido com status SHIPPED
      const orderId = await getFirstOrderWithStatus(page, "Enviad")

      if (!orderId) {
        test.skip()
        return
      }

      // Atualiza para DELIVERED (Entregue)
      await updateOrderStatus(page, orderId, "Delivered")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyOrderStatus(page, orderId, "Delivered")
      expect(statusUpdated).toBeTruthy()
    })
  })

  test.describe("Fluxo de cancelamento", () => {
    test("Administrador cancela pedido aprovado", async ({ page }) => {
      await navigateToOrdersPage(page)

      // Busca um pedido com status APPROVED
      const orderId = await getFirstOrderWithStatus(page, "Aprovado")

      if (!orderId) {
        test.skip()
        return
      }

      // Atualiza para CANCELED
      await updateOrderStatus(page, orderId, "Canceled")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyOrderStatus(page, orderId, "Canceled")
      expect(statusUpdated).toBeTruthy()
    })
  })
})
