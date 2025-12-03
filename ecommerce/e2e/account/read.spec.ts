import { test, expect } from "@playwright/test"
import {
  setAuthToken,
  AUTH_TOKEN_CUSTOMER,
  waitForSkeletonToDisappear,
  navigateToAddressesTab,
  navigateToPaymentMethodsTab,
  navigateToExchangesTab,
  navigateToSettingsTab,
} from "./../helpers/test-helpers"

test.describe("Visualização de Dados do Cliente", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await setAuthToken(page, AUTH_TOKEN_CUSTOMER)
    await page.goto("/conta")
  })

  test("Deve carregar a página de conta corretamente", async ({ page }) => {
    await expect(page).toHaveURL("/conta")
    await expect(page.getByRole("heading", { name: /minha conta/i })).toBeVisible({ timeout: 10000 })

    await expect(page.getByRole("button", { name: /meus pedidos/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /endereços/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /formas de pagamento/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /trocas/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /configurações/i })).toBeVisible()
  })

  test.describe("Aba Meus Pedidos", () => {
    test("Deve exibir a aba de pedidos por padrão", async ({ page }) => {
      await waitForSkeletonToDisappear(page)

      await expect(
        page
          .locator("h2")
          .filter({ hasText: /meus pedidos/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })
    })

    test("Deve exibir mensagem quando não há pedidos ou listar pedidos existentes", async ({ page }) => {
      await waitForSkeletonToDisappear(page)

      const hasOrders = await page
        .locator("text=Pedido #")
        .first()
        .isVisible()
        .catch(() => false)

      if (hasOrders) {
        await expect(page.locator("text=Pedido #").first()).toBeVisible()
        await expect(page.getByRole("link", { name: /ver detalhes/i }).first()).toBeVisible()
      } else {
        await expect(page.getByText(/você ainda não fez nenhum pedido/i)).toBeVisible()
        await expect(page.getByRole("link", { name: /começar a comprar/i })).toBeVisible()
      }
    })
  })

  test.describe("Aba Endereços", () => {
    test("Deve navegar para a aba de endereços", async ({ page }) => {
      await navigateToAddressesTab(page)

      await expect(
        page
          .locator("h2")
          .filter({ hasText: /meus endereços/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })
    })

    test("Deve exibir endereços cadastrados ou mensagem de vazio", async ({ page }) => {
      await navigateToAddressesTab(page)

      const hasAddresses = await page
        .locator("text=CEP:")
        .first()
        .isVisible()
        .catch(() => false)

      if (hasAddresses) {
        await expect(page.locator("text=CEP:").first()).toBeVisible()
        await expect(page.getByRole("button", { name: /editar/i }).first()).toBeVisible()
        await expect(page.getByRole("button", { name: /excluir/i }).first()).toBeVisible()
      } else {
        await expect(page.getByText(/nenhum endereço cadastrado/i)).toBeVisible()
      }

      await expect(page.getByRole("button", { name: /adicionar endereço/i })).toBeVisible()
    })
  })

  test.describe("Aba Formas de Pagamento", () => {
    test("Deve navegar para a aba de formas de pagamento", async ({ page }) => {
      await navigateToPaymentMethodsTab(page)

      await expect(
        page
          .locator("h2")
          .filter({ hasText: /formas de pagamento/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })
    })

    test("Deve exibir cartões cadastrados ou mensagem de vazio", async ({ page }) => {
      await navigateToPaymentMethodsTab(page)

      const hasCards = await page
        .locator("text=terminado em")
        .first()
        .isVisible()
        .catch(() => false)

      if (hasCards) {
        await expect(page.locator("text=terminado em").first()).toBeVisible()
        await expect(page.locator("text=Validade:").first()).toBeVisible()
        await expect(page.getByRole("button", { name: /remover/i }).first()).toBeVisible()
      } else {
        await expect(page.getByText(/nenhum cartão cadastrado/i)).toBeVisible()
      }

      await expect(page.getByRole("button", { name: /adicionar cartão/i })).toBeVisible()
    })
  })

  test.describe("Aba Trocas e Devoluções", () => {
    test("Deve navegar para a aba de trocas", async ({ page }) => {
      await navigateToExchangesTab(page)

      await expect(
        page
          .locator("h2")
          .filter({ hasText: /trocas e devoluções/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })
    })

    test("Deve exibir solicitações de troca ou mensagem de vazio", async ({ page }) => {
      await navigateToExchangesTab(page)

      const hasRequests = await page
        .locator("text=Solicitação #")
        .first()
        .isVisible()
        .catch(() => false)

      if (hasRequests) {
        await expect(page.locator("text=Solicitação #").first()).toBeVisible()
        await expect(page.getByRole("link", { name: /ver detalhes/i }).first()).toBeVisible()
      } else {
        await expect(page.getByText(/você não tem trocas em andamento/i)).toBeVisible()
      }
    })
  })

  test.describe("Aba Configurações", () => {
    test("Deve navegar para a aba de configurações", async ({ page }) => {
      await navigateToSettingsTab(page)

      await expect(
        page
          .locator("h2")
          .filter({ hasText: /configurações da conta/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })
    })

    test("Deve verificar que campos de email, telefone e CPF estão desabilitados", async ({ page }) => {
      await navigateToSettingsTab(page)

      await expect(page.locator("#email")).toBeDisabled()
      await expect(page.locator("#phone")).toBeDisabled()
      await expect(page.locator("#cpf")).toBeDisabled()
    })

    test("Deve exibir seção de alteração de senha", async ({ page }) => {
      await navigateToSettingsTab(page)

      await expect(page.getByText(/alterar senha/i).first()).toBeVisible()
      await expect(page.locator("#current-password")).toBeVisible()
      await expect(page.locator("#new-password")).toBeVisible()
      await expect(page.locator("#confirm-password")).toBeVisible()
    })

    test("Deve exibir seção de preferências", async ({ page }) => {
      await navigateToSettingsTab(page)

      await expect(page.getByText(/preferências/i).first()).toBeVisible()
      await expect(page.locator("#newsletter")).toBeVisible()
      await expect(page.locator("#order-updates")).toBeVisible()
      await expect(page.locator("#recommendations")).toBeVisible()
    })

    test("Deve exibir zona de perigo com opção de desativar conta", async ({ page }) => {
      await navigateToSettingsTab(page)

      await expect(page.getByText(/zona de perigo/i)).toBeVisible()
      await expect(page.getByText(/desativar conta/i).first()).toBeVisible()
      await expect(page.getByRole("button", { name: /desativar minha conta/i })).toBeVisible()
    })
  })

  test.describe("Navegação entre abas", () => {
    test("Deve navegar corretamente entre todas as abas", async ({ page }) => {
      await expect(
        page
          .locator("h2")
          .filter({ hasText: /meus pedidos/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: /endereços/i }).click()
      await expect(
        page
          .locator("h2")
          .filter({ hasText: /meus endereços/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: /formas de pagamento/i }).click()
      await expect(
        page
          .locator("h2")
          .filter({ hasText: /formas de pagamento/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: /trocas/i }).click()
      await expect(
        page
          .locator("h2")
          .filter({ hasText: /trocas e devoluções/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: /configurações/i }).click()
      await expect(
        page
          .locator("h2")
          .filter({ hasText: /configurações da conta/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: /meus pedidos/i }).click()
      await expect(
        page
          .locator("h2")
          .filter({ hasText: /meus pedidos/i })
          .first(),
      ).toBeVisible({ timeout: 10000 })
    })
  })
})
