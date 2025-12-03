import type { Page } from "@playwright/test"

export const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjQ1Njk1MDZ9.vIu6TcZoJ7hXJjADKhTX9sLY9ngHDEvtxdwYTzo8QV4"
export const AUTH_USER = {
  id: "admin",
  email: "admin@admin.com",
  role: "admin",
}

export async function setupAuth(page: Page) {
  await page.addInitScript(
    (auth) => {
      localStorage.setItem("auth_token", auth.token)
      localStorage.setItem("auth_user", JSON.stringify(auth.user))
    },
    { token: AUTH_TOKEN, user: AUTH_USER },
  )
}

/**
 * Helper: Aguarda skeleton desaparecer de forma segura
 */
export async function waitForSkeletonToDisappear(page: Page, selector: string, timeout = 10000) {
  const skeleton = page.locator(selector).first()
  await skeleton.waitFor({ state: "detached", timeout }).catch(() => {})
}

/**
 * Helper: Aguarda a tabela carregar (skeletons desaparecerem)
 */
export async function waitForTableToLoad(page: Page, timeout = 15000) {
  // Aguarda skeletons padrão do projeto desaparecerem
  await waitForSkeletonToDisappear(page, ".h-4.w-full", timeout)
  await waitForSkeletonToDisappear(page, ".h-4.w-3\\/4", timeout)
}

/**
 * Helper: Fecha toasts de diferentes bibliotecas
 */
export async function closeToasts(page: Page) {
  // Fecha toasts do Sonner/shadcn (data-sonner-toast)
  const sonnerCloseButtons = page.locator("[data-sonner-toast] button[data-close-button]")
  const sonnerCount = await sonnerCloseButtons.count()
  for (let i = 0; i < sonnerCount; i++) {
    await sonnerCloseButtons
      .nth(i)
      .click()
      .catch(() => {})
  }

  // Fecha toasts genéricos com aria-label close
  const genericCloseButtons = page.locator('[role="status"] button[aria-label*="close"], [role="alert"] button')
  const genericCount = await genericCloseButtons.count()
  for (let i = 0; i < genericCount; i++) {
    await genericCloseButtons
      .nth(i)
      .click()
      .catch(() => {})
  }

  await page.waitForTimeout(300)
}

/**
 * Helper: Faz login como admin via localStorage
 */
export async function loginAsAdmin(page: Page) {
  await page.evaluate(() => {
    // Token de admin para testes
    localStorage.setItem(
      "admin_token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjAwNTE0MDZ9.test_admin_token",
    )
  })
}

/**
 * Helper: Navega para a página de pedidos
 */
export async function navigateToOrdersPage(page: Page) {
  await page.goto("/dashboard/orders")
  await waitForTableToLoad(page)
}

/**
 * Helper: Navega para a página de trocas/devoluções
 */
export async function navigateToReturnsPage(page: Page) {
  await page.goto("/dashboard/returns")
  await waitForTableToLoad(page)
}

/**
 * Helper: Atualiza status de um pedido via dialog
 */
export async function updateOrderStatus(page: Page, orderId: string, newStatus: string) {
  // Encontra a linha do pedido e clica no botão "Atualizar Status"
  const orderRow = page.locator(`tr:has-text("#${orderId}")`)
  const updateButton = orderRow.getByRole("button", { name: /atualizar status/i })
  await updateButton.click()

  // Aguarda o dialog abrir
  await page.waitForSelector('[role="dialog"]', { state: "visible" })

  // Seleciona o novo status
  const statusSelect = page.locator('[role="dialog"]').locator('button[role="combobox"]')
  await statusSelect.click()

  // Clica na opção do status desejado
  const statusOption = page.getByRole("option", { name: new RegExp(newStatus, "i") })
  await statusOption.click()

  // Confirma a atualização
  const confirmButton = page.locator('[role="dialog"]').getByRole("button", { name: /atualizar status/i })
  await confirmButton.click()

  // Aguarda o dialog fechar
  await page.waitForSelector('[role="dialog"]', { state: "detached", timeout: 5000 }).catch(() => {})

  await closeToasts(page)
}

/**
 * Helper: Atualiza status de uma solicitação de troca/devolução via select na tabela
 */
export async function updateReturnExchangeStatus(page: Page, requestId: string, newStatus: string) {
  // Encontra a linha da solicitação
  const requestRow = page.locator(`tr:has-text("#${requestId}")`)

  // Clica no select de status na linha
  const statusSelect = requestRow.locator('button[role="combobox"]')
  await statusSelect.click()

  // Seleciona o novo status
  const statusOption = page.getByRole("option", { name: new RegExp(newStatus, "i") })
  await statusOption.click()

  // Aguarda o dialog de confirmação abrir
  await page.waitForSelector('[role="dialog"]', { state: "visible" })

  // Confirma a atualização
  const confirmButton = page.locator('[role="dialog"]').getByRole("button", { name: /confirm/i })
  await confirmButton.click()

  // Aguarda o dialog fechar
  await page.waitForSelector('[role="dialog"]', { state: "detached", timeout: 5000 }).catch(() => {})

  await closeToasts(page)
}

/**
 * Helper: Verifica se um pedido tem determinado status
 */
export async function verifyOrderStatus(page: Page, orderId: string, expectedStatus: string) {
  const orderRow = page.locator(`tr:has-text("#${orderId}")`)
  const statusBadge = orderRow.locator(
    ".bg-yellow-100, .bg-blue-100, .bg-red-100, .bg-gray-100, .bg-purple-100, .bg-green-100",
  )

  await statusBadge.waitFor({ state: "visible" })
  const statusText = await statusBadge.textContent()

  return statusText?.toLowerCase().includes(expectedStatus.toLowerCase())
}

/**
 * Helper: Verifica se uma solicitação tem determinado status
 */
export async function verifyReturnExchangeStatus(page: Page, requestId: string, expectedStatus: string) {
  const requestRow = page.locator(`tr:has-text("#${requestId}")`)
  const statusCell = requestRow.locator("td").nth(6) // Coluna de status

  await statusCell.waitFor({ state: "visible" })
  const statusText = await statusCell.textContent()

  return statusText?.toLowerCase().includes(expectedStatus.toLowerCase())
}

/**
 * Helper: Filtra pedidos por status
 */
export async function filterOrdersByStatus(page: Page, status: string) {
  const statusFilter = page
    .locator('button[role="combobox"]')
    .filter({ hasText: /todos os status|status/i })
    .first()
  await statusFilter.click()

  const statusOption = page.getByRole("option", { name: new RegExp(status, "i") })
  await statusOption.click()

  await waitForTableToLoad(page)
}

/**
 * Helper: Filtra solicitações por tipo (return/exchange)
 */
export async function filterReturnsByType(page: Page, type: "return" | "exchange" | "all") {
  const typeFilter = page
    .locator('button[role="combobox"]')
    .filter({ hasText: /all types|type/i })
    .first()
  await typeFilter.click()

  const typeMap = {
    return: "Returns",
    exchange: "Exchanges",
    all: "All Types",
  }

  const typeOption = page.getByRole("option", { name: typeMap[type] })
  await typeOption.click()

  await waitForTableToLoad(page)
}

/**
 * Helper: Obtém o primeiro pedido da lista com determinado status
 */
export async function getFirstOrderWithStatus(page: Page, status: string): Promise<string | null> {
  await filterOrdersByStatus(page, status)

  const firstRow = page.locator("tbody tr").first()
  const isVisible = await firstRow.isVisible().catch(() => false)

  if (!isVisible) return null

  const orderId = await firstRow.locator("td").first().textContent()
  return orderId?.replace("#", "") || null
}

/**
 * Helper: Obtém a primeira solicitação de troca/devolução com determinado status
 */
export async function getFirstReturnExchangeWithStatus(page: Page, status: string): Promise<string | null> {
  // Filtra por status
  const statusFilter = page
    .locator('button[role="combobox"]')
    .filter({ hasText: /todos os status/i })
    .first()
  await statusFilter.click()

  const statusOption = page.getByRole("option", { name: new RegExp(status, "i") })
  await statusOption.click()

  await waitForTableToLoad(page)

  const firstRow = page.locator("tbody tr").first()
  const isVisible = await firstRow.isVisible().catch(() => false)

  if (!isVisible) return null

  const requestId = await firstRow.locator("td").first().textContent()
  return requestId?.replace("#", "") || null
}
