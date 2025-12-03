import { test, expect } from "@playwright/test"
import {
  setAuthToken,
  AUTH_TOKEN_CUSTOMER,
  waitForSkeletonToDisappear,
  waitForImages,
  selectFirstBook,
  addToCart,
  goToCart,
  goToCheckout,
  goToPaymentStep,
  goToConfirmationStep,
  completePurchase,
  addNewAddressInCheckout,
  fillTemporaryCardPayment,
  addSavedCardInCheckout,
  enableMultipleCards,
  addNewCardToMultiplePayment,
  updateCardAmountInMultiplePayment,
} from "../helpers/test-helpers"

test.describe("Fluxo de Compra de Livro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await setAuthToken(page, AUTH_TOKEN_CUSTOMER)
    await page.goto("/")
  })

  test("Deve carregar a página inicial corretamente", async ({ page }) => {
    await expect(page).toHaveURL("/")
    await expect(page.getByText(/livros em promoção/i)).toBeVisible({ timeout: 10000 })
    await waitForSkeletonToDisappear(page, ".h-\\[300px\\].w-full.rounded-md", 15000)

    const promotionsSection = page.locator("section").filter({ hasText: /livros em promoção/i })
    await waitForImages(page, "section:has-text('Livros em Promoção') a[href^='/livro/']", 15000)

    const primeiraImagem = promotionsSection.locator("a[href^='/livro/'] img").first()
    await expect(primeiraImagem).toBeVisible({ timeout: 5000 })
  })

  test.describe("Compra com cartão único", () => {
    test("Deve realizar compra com novo cartão temporário e endereço", async ({ page }) => {
      await selectFirstBook(page)
      await addToCart(page)
      await goToCart(page)
      await goToCheckout(page)

      await addNewAddressInCheckout(page, {
        alias: "Casa Teste",
        zipCode: "01001000",
        street: "Praça da Sé",
        number: "100",
        complement: "Apto 10",
        district: "Sé",
        city: "São Paulo",
        state: "SP",
      })

      await goToPaymentStep(page)

      await fillTemporaryCardPayment(page, {
        number: "4111111111111111",
        name: "Teste Usuario",
        expiry: "12/30",
        cvv: "123",
        brand: "Visa",
      })

      await goToConfirmationStep(page)
      await completePurchase(page)
    })

    test("Deve realizar compra com cartão salvo previamente", async ({ page }) => {
      await selectFirstBook(page)
      await addToCart(page)
      await goToCart(page)
      await goToCheckout(page)

      await addNewAddressInCheckout(page, {
        alias: "Casa Principal",
        zipCode: "01001000",
        street: "Praça da Sé",
        number: "200",
        complement: "",
        district: "Sé",
        city: "São Paulo",
        state: "SP",
      })

      await goToPaymentStep(page)

      await addSavedCardInCheckout(page, {
        number: "5500000000000004",
        name: "Usuario Salvo",
        expiry: "06/28",
        cvv: "456",
        brand: "Mastercard",
      })

      await goToConfirmationStep(page)
      await completePurchase(page)
    })
  })

  test.describe("Compra com múltiplos cartões", () => {
    test("Deve realizar compra dividindo pagamento em 2 cartões", async ({ page }) => {
      await selectFirstBook(page)
      await addToCart(page)
      await goToCart(page)
      await goToCheckout(page)

      await addNewAddressInCheckout(page, {
        alias: "Escritório",
        zipCode: "01001000",
        street: "Praça da Sé",
        number: "300",
        complement: "",
        district: "Sé",
        city: "São Paulo",
        state: "SP",
      })

      await goToPaymentStep(page)

      await enableMultipleCards(page)
      await page.waitForTimeout(500)

      await addNewCardToMultiplePayment(page, {
        number: "4111111111111111",
        name: "Cartao Um",
        expiry: "12/30",
        cvv: "123",
      })

      await updateCardAmountInMultiplePayment(page, 0, "50.00")

      await addNewCardToMultiplePayment(page, {
        number: "5500000000000004",
        name: "Cartao Dois",
        expiry: "06/28",
        cvv: "456",
      })

      await goToConfirmationStep(page)
      await completePurchase(page)
    })
  })
})
