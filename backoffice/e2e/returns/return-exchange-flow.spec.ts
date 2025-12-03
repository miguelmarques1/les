import { test, expect } from "@playwright/test"
import {
  setupAuth, // Added setupAuth import
  waitForTableToLoad,
  navigateToReturnsPage,
  updateReturnExchangeStatus,
  verifyReturnExchangeStatus,
  getFirstReturnExchangeWithStatus,
  filterReturnsByType,
} from "../helpers/test-helpers"

/**
 * Fluxo de Status de Trocas e Devoluções
 *
 * Ordem válida de transições para TROCA:
 * EXCHANGE_REQUESTED -> EXCHANGE_ACCEPTED | EXCHANGE_REJECTED
 * EXCHANGE_ACCEPTED -> EXCHANGE_COMPLETED (gera cupom automaticamente)
 *
 * Ordem válida de transições para DEVOLUÇÃO:
 * RETURN_REQUESTED -> RETURN_REJECTED | RETURN_COMPLETED
 *
 * Status finais: EXCHANGE_REJECTED, EXCHANGE_COMPLETED, RETURN_REJECTED, RETURN_COMPLETED
 */
test.describe("Fluxo de Trocas e Devoluções", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
    await page.goto("/")
  })

  test.describe("Fluxo de Troca (Exchange)", () => {
    test("Administrador aceita solicitação de troca", async ({ page }) => {
      await navigateToReturnsPage(page)

      // Filtra por trocas
      await filterReturnsByType(page, "exchange")

      // Busca uma solicitação com status EXCHANGE_REQUESTED
      const requestId = await getFirstReturnExchangeWithStatus(page, "Exchange Requested")

      if (!requestId) {
        test.skip()
        return
      }

      // Atualiza para EXCHANGE_ACCEPTED
      await updateReturnExchangeStatus(page, requestId, "Exchange Accepted")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyReturnExchangeStatus(page, requestId, "Accepted")
      expect(statusUpdated).toBeTruthy()
    })

    test("Administrador rejeita solicitação de troca", async ({ page }) => {
      await navigateToReturnsPage(page)

      // Filtra por trocas
      await filterReturnsByType(page, "exchange")

      // Busca uma solicitação com status EXCHANGE_REQUESTED
      const requestId = await getFirstReturnExchangeWithStatus(page, "Exchange Requested")

      if (!requestId) {
        test.skip()
        return
      }

      // Atualiza para EXCHANGE_REJECTED
      await updateReturnExchangeStatus(page, requestId, "Exchange Rejected")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyReturnExchangeStatus(page, requestId, "Rejected")
      expect(statusUpdated).toBeTruthy()
    })

    test("Administrador confirma recebimento do produto e conclui troca (gera cupom)", async ({ page }) => {
      await navigateToReturnsPage(page)

      // Filtra por trocas
      await filterReturnsByType(page, "exchange")

      // Busca uma solicitação com status EXCHANGE_ACCEPTED
      const requestId = await getFirstReturnExchangeWithStatus(page, "Exchange Accepted")

      if (!requestId) {
        test.skip()
        return
      }

      // Atualiza para EXCHANGE_COMPLETED (isso deve gerar o cupom automaticamente no backend)
      await updateReturnExchangeStatus(page, requestId, "Exchange Completed")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyReturnExchangeStatus(page, requestId, "Completed")
      expect(statusUpdated).toBeTruthy()

      // O cupom é gerado automaticamente no backend quando o status é COMPLETED
      // Não há UI para verificar o cupom nesta página, mas o teste valida que a transição foi feita
    })
  })

  test.describe("Fluxo de Devolução (Return)", () => {
    test("Administrador confirma recebimento e conclui devolução", async ({ page }) => {
      await navigateToReturnsPage(page)

      // Filtra por devoluções
      await filterReturnsByType(page, "return")

      // Busca uma solicitação com status RETURN_REQUESTED
      const requestId = await getFirstReturnExchangeWithStatus(page, "Return Requested")

      if (!requestId) {
        test.skip()
        return
      }

      // Atualiza para RETURN_COMPLETED
      await updateReturnExchangeStatus(page, requestId, "Return Completed")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyReturnExchangeStatus(page, requestId, "Completed")
      expect(statusUpdated).toBeTruthy()
    })

    test("Administrador rejeita solicitação de devolução", async ({ page }) => {
      await navigateToReturnsPage(page)

      // Filtra por devoluções
      await filterReturnsByType(page, "return")

      // Busca uma solicitação com status RETURN_REQUESTED
      const requestId = await getFirstReturnExchangeWithStatus(page, "Return Requested")

      if (!requestId) {
        test.skip()
        return
      }

      // Atualiza para RETURN_REJECTED
      await updateReturnExchangeStatus(page, requestId, "Return Rejected")

      // Verifica se o status foi atualizado
      await page.reload()
      await waitForTableToLoad(page)

      const statusUpdated = await verifyReturnExchangeStatus(page, requestId, "Rejected")
      expect(statusUpdated).toBeTruthy()
    })
  })
})
