import { test, expect, type Page } from "@playwright/test"
import { setAuthToken, AUTH_TOKEN_CUSTOMER, waitForSkeletonToDisappear } from "../helpers/test-helpers"

test.describe("Fluxo de Troca e Devolução", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await setAuthToken(page, AUTH_TOKEN_CUSTOMER)
    await page.goto("/")
  })

  test("Deve solicitar troca com um item", async ({ page }) => {
    await navigateToDeliveredOrder(page)
    await openReturnExchangeModal(page)

    await selectType(page, "troca")
    await selectItems(page, 1)
    await fillReason(page, "Livro veio com páginas danificadas.")

    await submitRequest(page)
  })

  test("Deve solicitar troca com dois itens", async ({ page }) => {
    await navigateToDeliveredOrder(page)
    await openReturnExchangeModal(page)

    await selectType(page, "troca")
    await selectItems(page, 2)
    await fillReason(page, "Ambos os livros vieram com defeito de impressão.")

    await submitRequest(page)
  })

  test("Deve solicitar devolução com um item", async ({ page }) => {
    await navigateToDeliveredOrder(page)
    await openReturnExchangeModal(page)

    await selectType(page, "devolucao")
    await selectItems(page, 1)
    await fillReason(page, "Comprei por engano, gostaria de devolver.")

    await submitRequest(page)
  })
})

// ===== FUNÇÕES AUXILIARES LOCAIS =====

async function navigateToDeliveredOrder(page: Page) {
  await page.goto("/conta")
  await expect(page.getByRole("heading", { name: /minha conta/i })).toBeVisible({ timeout: 10000 })

  await waitForSkeletonToDisappear(page, ".animate-pulse", 10000)
  await page.waitForTimeout(500)

  const pedidoEntregue = page
    .locator(".border.rounded-lg")
    .filter({ hasText: /entregue/i })
    .first()
  await expect(pedidoEntregue).toBeVisible({ timeout: 10000 })

  const verDetalhesButton = pedidoEntregue.getByRole("link", { name: /ver detalhes/i })
  await expect(verDetalhesButton).toBeVisible()
  await verDetalhesButton.click()

  await expect(page).toHaveURL(/\/pedido\/\d+/, { timeout: 10000 })
  await expect(page.getByRole("heading", { name: /detalhes do pedido/i })).toBeVisible({ timeout: 10000 })
}

async function openReturnExchangeModal(page: Page) {
  const solicitarButton = page.getByRole("button", { name: /solicitar troca ou devolução/i })
  await expect(solicitarButton).toBeVisible({ timeout: 5000 })
  await solicitarButton.click()

  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 })
}

async function selectItems(page: Page, quantidade: number) {
  const checkboxes = page.locator("[role='dialog'] [role='checkbox']")
  const total = await checkboxes.count()
  const selecionaveis = Math.min(quantidade, total)

  for (let i = 0; i < selecionaveis; i++) {
    await checkboxes.nth(i).click()
    await page.waitForTimeout(200)
  }
}

async function fillReason(page: Page, motivo: string) {
  const textarea = page.locator("[role='dialog'] textarea")
  await expect(textarea).toBeVisible()
  await textarea.fill(motivo)
}

async function selectType(page: Page, tipo: "troca" | "devolucao") {
  const buttonText = tipo === "troca" ? "Troca" : "Devolução"
  const tipoButton = page.locator("[role='dialog']").getByRole("button", { name: buttonText, exact: true })
  await expect(tipoButton).toBeVisible()
  await tipoButton.click()
}

async function submitRequest(page: Page) {
  const enviarButton = page.locator("[role='dialog']").getByRole("button", { name: /enviar solicitação/i })
  await expect(enviarButton).toBeEnabled()
  await enviarButton.click()

  await expect(page.locator("[role='dialog']")).not.toBeVisible({ timeout: 10000 })
}
