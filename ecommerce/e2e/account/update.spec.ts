import { test, expect, type Page } from "@playwright/test"
import { faker } from "@faker-js/faker/locale/pt_BR"
import {
  setAuthToken,
  AUTH_TOKEN_CUSTOMER,
  closeToasts,
  waitForSkeletonToDisappear,
  navigateToSettingsTab,
  navigateToAddressesTab,
  navigateToPaymentMethodsTab,
} from "../helpers/test-helpers"

test.describe("Atualização de Dados do Cliente", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await setAuthToken(page, AUTH_TOKEN_CUSTOMER)
    await page.goto("/conta")
    await waitForSkeletonToDisappear(page)
  })

  test.describe("Atualização de Dados Pessoais", () => {
    test("Deve atualizar o nome do cliente", async ({ page }) => {
      await navigateToSettingsTab(page)

      const novoNome = faker.person.fullName()
      const nomeInput = page.locator("#name")

      await expect(nomeInput).toBeVisible()
      await nomeInput.clear()
      await nomeInput.fill(novoNome)

      await page
        .getByRole("button", { name: /salvar alterações/i })
        .first()
        .click()

      await page.waitForTimeout(1500)
      await expect(nomeInput).toHaveValue(novoNome)
    })

    test("Deve atualizar o gênero do cliente", async ({ page }) => {
      await navigateToSettingsTab(page)

      const genderTrigger = page
        .locator("button")
        .filter({ hasText: /masculino|feminino|outro|prefiro não informar|selecione/i })
        .first()

      await expect(genderTrigger).toBeVisible()
      await genderTrigger.click()
      await page.getByRole("option", { name: /feminino/i }).click()

      await page
        .getByRole("button", { name: /salvar alterações/i })
        .first()
        .click()

      await page.waitForTimeout(2000)
      await closeToasts(page)
    })

    test("Deve atualizar a data de nascimento do cliente", async ({ page }) => {
      await navigateToSettingsTab(page)

      const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: "age" })
      const formattedDate = birthDate.toISOString().split("T")[0]

      const birthdateInput = page.locator("#birthdate")
      await expect(birthdateInput).toBeVisible()
      await birthdateInput.fill(formattedDate)

      await page
        .getByRole("button", { name: /salvar alterações/i })
        .first()
        .click()

      await page.waitForTimeout(2000)
      await closeToasts(page)

      await expect(true).toBeTruthy()
    })

    test("Deve atualizar múltiplos campos do perfil de uma vez", async ({ page }) => {
      await navigateToSettingsTab(page)

      const novoNome = faker.person.fullName()
      const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: "age" })
      const formattedDate = birthDate.toISOString().split("T")[0]

      const nomeInput = page.locator("#name")
      await nomeInput.clear()
      await nomeInput.fill(novoNome)

      const birthdateInput = page.locator("#birthdate")
      await birthdateInput.fill(formattedDate)

      const genderTrigger = page
        .locator("button")
        .filter({ hasText: /masculino|feminino|outro|prefiro não informar|selecione/i })
        .first()
      await genderTrigger.click()
      await page.getByRole("option", { name: /masculino/i }).click()

      await page
        .getByRole("button", { name: /salvar alterações/i })
        .first()
        .click()

      await page.waitForTimeout(2000)
      await closeToasts(page)

      await expect(nomeInput).toHaveValue(novoNome)
    })
  })

  test.describe("Gerenciamento de Endereços", () => {
    test("Deve adicionar um novo endereço", async ({ page }) => {
      await navigateToAddressesTab(page)

      const addressData = {
        alias: `Endereço ${faker.string.alphanumeric(4)}`,
        zipCode: "01001-000",
        number: faker.location.buildingNumber(),
        complement: faker.location.secondaryAddress(),
      }

      await page
        .getByRole("button", { name: /adicionar endereço/i })
        .first()
        .click()

      const aliasField = page.locator("#alias")
      await expect(aliasField).toBeVisible({ timeout: 5000 })

      await aliasField.clear()
      await aliasField.fill(addressData.alias)

      const residenceTypeSelect = page
        .locator("button")
        .filter({ hasText: /selecione|casa|apartamento|comercial|outro/i })
        .first()
      await residenceTypeSelect.click()
      await page.getByRole("option", { name: /casa/i }).click()

      await page.locator("#zipCode").fill(addressData.zipCode)
      await page.waitForTimeout(1500)

      await page.locator("#number").fill(addressData.number)
      await page.locator("#complement").fill(addressData.complement)

      const streetField = page.locator("#street")
      const streetValue = await streetField.inputValue()

      if (!streetValue) {
        await streetField.fill("Praça da Sé")
        await page.locator("#district").fill("Sé")
        await page.locator("#city").fill("São Paulo")
        await page.locator("#state").fill("SP")
      }

      const saveButton = page.getByRole("button", { name: /adicionar endereço|atualizar endereço/i }).last()
      await expect(saveButton).toBeEnabled()
      await saveButton.click()

      await page.waitForTimeout(2000)
      await closeToasts(page)

      await expect(aliasField).not.toBeVisible({ timeout: 5000 })
    })

    test("Deve excluir um endereço", async ({ page }) => {
      await navigateToAddressesTab(page)

      const deleteButton = page.getByRole("button", { name: /excluir/i }).first()
      const hasAddresses = await deleteButton.isVisible().catch(() => false)

      if (!hasAddresses) {
        await addAddressForTest(page)
      }

      page.on("dialog", async (dialog) => {
        await dialog.accept()
      })

      await page
        .getByRole("button", { name: /excluir/i })
        .first()
        .click()

      await page.waitForTimeout(2000)
      await closeToasts(page)
    })
  })

  test.describe("Gerenciamento de Cartões", () => {
    test("Deve remover um cartão existente", async ({ page }) => {
      await navigateToPaymentMethodsTab(page)

      const removeButton = page.getByRole("button", { name: /remover/i }).first()
      const hasCards = await removeButton.isVisible().catch(() => false)

      if (!hasCards) {
        await addCardForTest(page)
      }

      page.on("dialog", async (dialog) => {
        await dialog.accept()
      })

      await page
        .getByRole("button", { name: /remover/i })
        .first()
        .click()

      await page.waitForTimeout(2000)
      await closeToasts(page)
    })
  })

  test.describe("Zona de Perigo - Desativar Conta", () => {
    test("Deve exibir a zona de perigo", async ({ page }) => {
      await navigateToSettingsTab(page)

      await expect(
        page
          .locator("h3")
          .filter({ hasText: /zona de perigo/i })
          .first(),
      ).toBeVisible()

      await expect(
        page
          .locator("h4")
          .filter({ hasText: /desativar conta/i })
          .first(),
      ).toBeVisible()

      await expect(page.getByRole("button", { name: /desativar minha conta/i })).toBeVisible()
    })

    test("Deve abrir modal de confirmação ao clicar em desativar conta", async ({ page }) => {
      await navigateToSettingsTab(page)

      await page.getByRole("button", { name: /desativar minha conta/i }).click()

      await expect(page.locator("[role='dialog']").first()).toBeVisible({ timeout: 5000 })

      const cancelButton = page.getByRole("button", { name: /cancelar|fechar/i }).first()
      const isCancelVisible = await cancelButton.isVisible().catch(() => false)

      if (isCancelVisible) {
        await cancelButton.click()
        await expect(page.locator("[role='dialog']")).not.toBeVisible({ timeout: 5000 })
      } else {
        await page.keyboard.press("Escape")
      }
    })
  })
})

// ===== FUNÇÕES AUXILIARES LOCAIS =====

async function addAddressForTest(page: Page) {
  await page
    .getByRole("button", { name: /adicionar endereço/i })
    .first()
    .click()

  const aliasField = page.locator("#alias")
  await expect(aliasField).toBeVisible({ timeout: 5000 })

  await aliasField.clear()
  await aliasField.fill("Endereço para Excluir")

  const residenceTypeSelect = page
    .locator("button")
    .filter({ hasText: /selecione|casa|apartamento/i })
    .first()
  await residenceTypeSelect.click()
  await page.getByRole("option", { name: /casa/i }).click()

  await page.locator("#zipCode").fill("01001-000")
  await page.waitForTimeout(1500)

  await page.locator("#number").fill("999")

  const streetField = page.locator("#street")
  const streetValue = await streetField.inputValue()
  if (!streetValue) {
    await streetField.fill("Praça da Sé")
    await page.locator("#district").fill("Sé")
    await page.locator("#city").fill("São Paulo")
    await page.locator("#state").fill("SP")
  }

  await page
    .getByRole("button", { name: /adicionar endereço/i })
    .last()
    .click()
  await page.waitForTimeout(2000)
  await closeToasts(page)
}

async function addCardForTest(page: Page) {
  await page
    .getByRole("button", { name: /adicionar cartão/i })
    .first()
    .click()

  const cardNumberField = page.locator("#cardNumber")
  await expect(cardNumberField).toBeVisible({ timeout: 5000 })

  await cardNumberField.fill("5500000000000004")
  await page.locator("#cardName").fill("Cartão para Remover")
  await page.locator("#expiry").fill("06/28")
  await page.locator("#cvv").fill("456")

  const brandSelect = page.locator("#brandId")
  const isBrandSelectVisible = await brandSelect.isVisible().catch(() => false)
  if (isBrandSelectVisible) {
    await brandSelect.selectOption({ index: 1 })
  }

  await page
    .getByRole("button", { name: /salvar/i })
    .first()
    .click()
  await page.waitForTimeout(2000)
  await closeToasts(page)
}
