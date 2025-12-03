import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

// ===== CONSTANTES DE AUTENTICAÇÃO =====

export const AUTH_TOKEN_CUSTOMER =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NjAwNTE0MDZ9._pRyQ0HfqSPGHKeXyYQJx6sp2uX4yCZ2vXUoG4CR4GQ"

export const AUTH_USER_CUSTOMER = {
  id: "5",
  email: "customer@test.com",
  role: "customer",
}

// ===== HELPERS DE AUTENTICAÇÃO =====

/**
 * Configura autenticação de cliente no localStorage
 */
export async function setupAuthCustomer(page: Page) {
  await page.addInitScript(
    (auth) => {
      localStorage.setItem("auth_token", auth.token)
      localStorage.setItem("auth_user", JSON.stringify(auth.user))
    },
    { token: AUTH_TOKEN_CUSTOMER, user: AUTH_USER_CUSTOMER },
  )
}

/**
 * Configura token de autenticação via evaluate (após page.goto)
 */
export async function setAuthToken(page: Page, token: string = AUTH_TOKEN_CUSTOMER) {
  await page.evaluate((authToken) => {
    localStorage.setItem("auth_token", authToken)
  }, token)
}

// ===== HELPERS DE LOADING/SKELETON =====

/**
 * Aguarda skeleton desaparecer de forma segura
 */
export async function waitForSkeletonToDisappear(page: Page, selector = ".animate-pulse", timeout = 10000) {
  const skeleton = page.locator(selector).first()
  await skeleton.waitFor({ state: "detached", timeout }).catch(() => {})
}

/**
 * Aguarda imagens carregarem
 */
export async function waitForImages(page: Page, parentSelector?: string, timeout = 10000) {
  const selector = parentSelector ? `${parentSelector} img` : "img"
  const firstImage = page.locator(selector).first()
  await expect(firstImage)
    .toBeVisible({ timeout })
    .catch(() => {})
}

// ===== HELPERS DE TOAST =====

/**
 * Fecha toasts de diferentes bibliotecas (Sonner, Toastify, genéricos)
 */
export async function closeToasts(page: Page) {
  // Fecha toasts do Sonner/shadcn
  const sonnerCloseButtons = page.locator("[data-sonner-toast] button[data-close-button]")
  const sonnerCount = await sonnerCloseButtons.count()
  for (let i = 0; i < sonnerCount; i++) {
    await sonnerCloseButtons
      .nth(i)
      .click()
      .catch(() => {})
  }

  // Fecha toasts do Toastify
  const toastifyCloseButtons = page.locator(".Toastify__close-button")
  const toastifyCount = await toastifyCloseButtons.count()
  for (let i = 0; i < toastifyCount; i++) {
    await toastifyCloseButtons
      .nth(i)
      .click()
      .catch(() => {})
  }

  // Fecha toasts genéricos
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

// ===== HELPERS DE CONTA =====

/**
 * Navega para aba de configurações na conta
 */
export async function navigateToSettingsTab(page: Page) {
  await page.getByRole("button", { name: /configurações/i }).click()
  await waitForSkeletonToDisappear(page)
  await expect(
    page
      .locator("h2")
      .filter({ hasText: /configurações da conta/i })
      .first(),
  ).toBeVisible({ timeout: 10000 })
}

/**
 * Navega para aba de endereços na conta
 */
export async function navigateToAddressesTab(page: Page) {
  await page.getByRole("button", { name: /endereços/i }).click()
  await waitForSkeletonToDisappear(page)
  await expect(
    page
      .locator("h2")
      .filter({ hasText: /meus endereços/i })
      .first(),
  ).toBeVisible({ timeout: 10000 })
}

/**
 * Navega para aba de formas de pagamento na conta
 */
export async function navigateToPaymentMethodsTab(page: Page) {
  await page.getByRole("button", { name: /formas de pagamento/i }).click()
  await waitForSkeletonToDisappear(page)
  await expect(
    page
      .locator("h2")
      .filter({ hasText: /formas de pagamento/i })
      .first(),
  ).toBeVisible({ timeout: 10000 })
}

/**
 * Navega para aba de trocas na conta
 */
export async function navigateToExchangesTab(page: Page) {
  await page.getByRole("button", { name: /trocas/i }).click()
  await waitForSkeletonToDisappear(page)
  await expect(
    page
      .locator("h2")
      .filter({ hasText: /trocas e devoluções/i })
      .first(),
  ).toBeVisible({ timeout: 10000 })
}

// ===== HELPERS DE COMPRA/CHECKOUT =====

/**
 * Seleciona o primeiro livro disponível na página inicial
 */
export async function selectFirstBook(page: Page) {
  const promotionsSection = page.locator("section").filter({ hasText: /livros em promoção/i })
  await waitForSkeletonToDisappear(page, ".h-\\[300px\\].w-full.rounded-md", 15000)

  const primeiraImagem = promotionsSection.locator("a[href^='/livro/'] img").first()
  await expect(primeiraImagem).toBeVisible({ timeout: 15000 })

  await primeiraImagem.scrollIntoViewIfNeeded()
  await primeiraImagem.click()

  await expect(page).toHaveURL(/\/livro\/\d+/, { timeout: 10000 })
}

/**
 * Adiciona o livro atual ao carrinho
 */
export async function addToCart(page: Page) {
  const addButton = page.getByRole("button", { name: "Adicionar ao Carrinho", exact: true })
  await expect(addButton).toBeVisible({ timeout: 10000 })
  await expect(addButton).toBeEnabled()
  await addButton.click()

  await page
    .waitForResponse((response) => response.url().includes("/cart") || response.url().includes("/carrinho"), {
      timeout: 5000,
    })
    .catch(() => page.waitForTimeout(500))
}

/**
 * Navega para o carrinho
 */
export async function goToCart(page: Page) {
  await closeToasts(page)

  const carrinhoButton = page.locator("a[href='/carrinho']").first()
  await expect(carrinhoButton).toBeVisible()
  await carrinhoButton.click()

  await expect(page).toHaveURL(/\/carrinho/, { timeout: 10000 })
  await waitForSkeletonToDisappear(page, ".h-32.w-24.rounded-md", 2000)
  await waitForImages(page, undefined, 10000)
}

/**
 * Navega para o checkout
 */
export async function goToCheckout(page: Page) {
  const checkoutLink = page.locator("a[href='/checkout']")
  await expect(checkoutLink).toBeVisible({ timeout: 10000 })
  await checkoutLink.click()

  await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 })
  await expect(page.getByRole("heading", { name: /endereço de entrega/i })).toBeVisible({ timeout: 10000 })
}

/**
 * Avança para o step de pagamento
 */
export async function goToPaymentStep(page: Page) {
  await closeToasts(page)

  const continuarButton = page
    .getByRole("button", { name: /continuar.*pagamento/i })
    .or(page.locator('button:has-text("Continuar para Pagamento")'))
    .first()

  await expect(continuarButton).toBeVisible({ timeout: 10000 })
  await expect(continuarButton).toBeEnabled()
  await continuarButton.click()

  await page.waitForTimeout(1000)
  await expect(
    page
      .locator("h2")
      .filter({ hasText: /forma.*pagamento/i })
      .first(),
  ).toBeVisible({ timeout: 10000 })
}

/**
 * Avança para o step de confirmação
 */
export async function goToConfirmationStep(page: Page) {
  await closeToasts(page)

  const revisarButton = page
    .getByRole("button", { name: /revisar.*pedido/i })
    .or(page.locator('button:has-text("Revisar Pedido")'))
    .first()

  await expect(revisarButton).toBeVisible({ timeout: 10000 })
  await expect(revisarButton).toBeEnabled()
  await revisarButton.click()

  await page.waitForTimeout(1000)
  await expect(
    page
      .locator("h2")
      .filter({ hasText: /revisar.*finalizar|confirmação/i })
      .first(),
  ).toBeVisible({ timeout: 10000 })
}

/**
 * Finaliza a compra
 */
export async function completePurchase(page: Page) {
  await closeToasts(page)

  const finalizarButton = page.getByRole("button", { name: /concluir.*pedido/i }).first()

  await expect(finalizarButton).toBeVisible()
  await expect(finalizarButton).toBeEnabled()
  await finalizarButton.click()

  await page.waitForURL("/", { timeout: 15000 }).catch(() => {
    return expect(page.locator("[data-sonner-toast]").filter({ hasText: /sucesso|realizado/i })).toBeVisible({
      timeout: 10000,
    })
  })
}

// ===== HELPERS DE FORMULÁRIO =====

/**
 * Adiciona novo endereço no checkout
 * Nota: O formulário de endereço no checkout não tem o campo residenceType,
 * ele usa o valor padrão ResidenceType.HOUSE automaticamente
 */
export async function addNewAddressInCheckout(
  page: Page,
  addressData: {
    alias: string
    zipCode: string
    street: string
    number: string
    complement: string
    district: string
    city: string
    state: string
    residenceType?: string
  },
) {
  const hasExistingAddress = (await page.locator('input[type="radio"][id^="address-"]').count()) > 0

  if (hasExistingAddress) {
    const addNewButton = page.getByRole("button", { name: /adicionar novo endereço/i })
    await expect(addNewButton).toBeVisible({ timeout: 5000 })
    await addNewButton.click()
  } else {
    const addAddressButton = page.getByRole("button", { name: /adicionar.*endereço/i }).first()
    await expect(addAddressButton).toBeVisible({ timeout: 5000 })
    await addAddressButton.click()
  }

  const aliasField = page.locator("#alias")
  await expect(aliasField).toBeVisible({ timeout: 5000 })

  await aliasField.fill(addressData.alias)

  // O checkout usa o valor padrão ResidenceType.HOUSE automaticamente

  await page.locator("#zipCode").fill(addressData.zipCode)
  await page.waitForTimeout(1500)

  const streetField = page.locator("#street")
  const streetValue = await streetField.inputValue()

  if (!streetValue) {
    await streetField.fill(addressData.street)
    await page.locator("#district").fill(addressData.district)
    await page.locator("#city").fill(addressData.city)
    await page.locator("#state").fill(addressData.state)
  }

  await page.locator("#number").fill(addressData.number)
  await page.locator("#complement").fill(addressData.complement)

  const saveButton = page.getByRole("button", { name: /salvar.*endereço/i }).first()
  await expect(saveButton).toBeEnabled()
  await saveButton.click()

  await expect(aliasField).not.toBeVisible({ timeout: 5000 })
}

/**
 * Preenche dados de pagamento com cartão temporário
 * Corrigido para clicar no botão "Usar Cartão Temporário" e usar os IDs corretos
 */
export async function fillTemporaryCardPayment(
  page: Page,
  cardData: { number: string; name: string; expiry: string; cvv: string; brand: string },
) {
  await closeToasts(page)

  // Clica no botão "Usar Cartão Temporário (Não Salvar)" para mostrar o formulário
  const useTemporaryCardButton = page.getByRole("button", { name: /usar cartão temporário/i })
  const isButtonVisible = await useTemporaryCardButton.isVisible().catch(() => false)

  if (isButtonVisible) {
    await useTemporaryCardButton.click()
    await page.waitForTimeout(500)
  }

  // Os IDs corretos são: cardNumber, cardName, cardExpiry, cardCvv
  const cardNumberField = page.locator("#cardNumber")
  await expect(cardNumberField).toBeVisible({ timeout: 5000 })

  await cardNumberField.fill(cardData.number)
  await page.locator("#cardName").fill(cardData.name)
  await page.locator("#cardExpiry").fill(cardData.expiry)
  await page.locator("#cardCvv").fill(cardData.cvv)
}

/**
 * Adiciona novo cartão salvo no checkout
 * Corrigido para usar os IDs corretos e o fluxo correto
 */
export async function addSavedCardInCheckout(
  page: Page,
  cardData: { number: string; name: string; expiry: string; cvv: string; brand: string },
) {
  await closeToasts(page)

  // Clica no botão "Adicionar Novo Cartão (Salvar)"
  const addCardButton = page.getByRole("button", { name: /adicionar novo cartão.*salvar/i })
  await expect(addCardButton).toBeVisible({ timeout: 5000 })
  await addCardButton.click()
  await page.waitForTimeout(500)

  // Os IDs corretos são: cardNumber, cardName, cardExpiry, cardCvv
  const cardNumberField = page.locator("#cardNumber")
  await expect(cardNumberField).toBeVisible({ timeout: 5000 })
  await expect(cardNumberField).toBeEnabled()

  await cardNumberField.fill(cardData.number)
  await page.locator("#cardName").fill(cardData.name)
  await page.locator("#cardExpiry").fill(cardData.expiry)
  await page.locator("#cardCvv").fill(cardData.cvv)

  // Clica no botão "Salvar Cartão"
  const saveButton = page.getByRole("button", { name: /salvar cartão/i })
  await expect(saveButton).toBeEnabled()
  await saveButton.click()

  await expect(cardNumberField).not.toBeVisible({ timeout: 5000 })
}

/**
 * Habilita pagamento com múltiplos cartões
 */
export async function enableMultipleCards(page: Page) {
  const multipleCardsCheckbox = page.locator("#use-multiple-cards")
  const isVisible = await multipleCardsCheckbox.isVisible().catch(() => false)

  if (isVisible) {
    const isChecked = await multipleCardsCheckbox.isChecked()
    if (!isChecked) {
      await multipleCardsCheckbox.click()
      await page.waitForTimeout(500)
    }
  }
}

/**
 * Adiciona cartão salvo ao pagamento múltiplo
 * No novo fluxo, os cartões salvos aparecem como botões na lista
 */
export async function addSavedCardToMultiplePayment(page: Page, cardEndingIn: string) {
  // Procura pelo botão do cartão que termina com os dígitos especificados
  const cardButton = page.getByRole("button", { name: new RegExp(`terminado em ${cardEndingIn}`, "i") })
  await expect(cardButton).toBeVisible({ timeout: 5000 })
  await cardButton.click()
  await page.waitForTimeout(300)
}

/**
 * Adiciona novo cartão temporário ao pagamento múltiplo
 * Clica em "Usar novo cartão" e preenche o formulário
 */
export async function addNewCardToMultiplePayment(
  page: Page,
  cardData: { number: string; name: string; expiry: string; cvv: string },
) {
  // Clica no botão "Usar novo cartão"
  const useNewCardButton = page.getByRole("button", { name: /usar novo cartão/i })
  await expect(useNewCardButton).toBeVisible({ timeout: 5000 })
  await useNewCardButton.click()
  await page.waitForTimeout(500)

  // Preenche o formulário do novo cartão no MultiCardPayment
  // Os IDs são: newCardNumber, newCardName, newCardExpiry, newCardCvv
  const cardNumberField = page.locator("#newCardNumber")
  await expect(cardNumberField).toBeVisible({ timeout: 5000 })

  await cardNumberField.fill(cardData.number)
  await page.locator("#newCardName").fill(cardData.name)
  await page.locator("#newCardExpiry").fill(cardData.expiry)
  await page.locator("#newCardCvv").fill(cardData.cvv)

  // Clica no botão "Adicionar" para adicionar o cartão ao pagamento
  const addButton = page.getByRole("button", { name: /^adicionar$/i })
  await expect(addButton).toBeVisible()
  await addButton.click()
  await page.waitForTimeout(300)
}

/**
 * Atualiza o valor de um cartão específico no pagamento múltiplo
 * @param cardIndex - Índice do cartão (0-based)
 * @param amount - Novo valor
 */
export async function updateCardAmountInMultiplePayment(page: Page, cardIndex: number, amount: string) {
  const amountField = page.locator(`#amount-${cardIndex}`)
  await expect(amountField).toBeVisible({ timeout: 5000 })
  await amountField.clear()
  await amountField.fill(amount)
}

/**
 * Mantém função antiga por compatibilidade mas redireciona para nova
 * @deprecated Use addNewCardToMultiplePayment ou addSavedCardToMultiplePayment
 */
export async function addCardForMultiplePayment(
  page: Page,
  cardData: { number: string; name: string; expiry: string; cvv: string; brand: string; valor: string },
) {
  // Usa a nova função para adicionar cartão temporário
  await addNewCardToMultiplePayment(page, {
    number: cardData.number,
    name: cardData.name,
    expiry: cardData.expiry,
    cvv: cardData.cvv,
  })

  // Se um valor específico foi fornecido, atualiza o valor do último cartão adicionado
  if (cardData.valor) {
    // Encontra o índice do último cartão adicionado
    const amountFields = page.locator('input[id^="amount-"]')
    const count = await amountFields.count()
    if (count > 0) {
      await updateCardAmountInMultiplePayment(page, count - 1, cardData.valor)
    }
  }
}

// ===== HELPERS DE UTILIDADE =====

/**
 * Gera um CPF válido para testes
 */
export function generateValidCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 9)

  const cpf = Array.from({ length: 9 }, randomDigits)

  // Calcula primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += cpf[i] * (10 - i)
  }
  let remainder = sum % 11
  cpf.push(remainder < 2 ? 0 : 11 - remainder)

  // Calcula segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += cpf[i] * (11 - i)
  }
  remainder = sum % 11
  cpf.push(remainder < 2 ? 0 : 11 - remainder)

  // Formata o CPF
  return `${cpf.slice(0, 3).join("")}.${cpf.slice(3, 6).join("")}.${cpf.slice(6, 9).join("")}-${cpf.slice(9).join("")}`
}

/**
 * Formata data para o formato esperado pelo input date
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}
