import { test, expect, Page } from "@playwright/test";
import { faker } from '@faker-js/faker/locale/pt_BR';

test.describe("Página de Cadastro", () => {
  let userData: {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
    dataNascimento: string;
  };

  test.beforeEach(async ({ page }) => {
    // Gerar novos dados a cada teste
    const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });

    userData = {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      cpf: gerarCPFValido(),
      telefone: faker.string.numeric(11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
      senha: `Senha${faker.string.alphanumeric(4)}@${faker.string.numeric(2)}`,
      dataNascimento: formatarData(birthDate)
    };

    await page.goto('/cadastro');
  });

  test("Deve carregar a página corretamente", async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Criar uma nova conta/i })).toBeVisible();
    await expect(page.getByText('1/3 - Dados Pessoais')).toBeVisible();
  });

  test.describe("Validações do Frontend", () => {
    test("Deve validar campos obrigatórios imediatamente", async ({ page }) => {
      await page.getByRole('button', { name: 'Próximo' }).click();

      // Validações que ocorrem antes do submit
      await expect(page.getByText('Selecione um gênero')).toBeVisible();
      await expect(page.getByText('Nome completo é obrigatório')).toBeVisible();
      await expect(page.getByText('Data de nascimento é obrigatória')).toBeVisible();
    });

    test("Deve validar formato de campos", async ({ page }) => {
      // Formato de CPF
      await page.getByPlaceholder('000.000.000-00').fill('123');
      await page.getByRole('button', { name: 'Próximo' }).click();
      await expect(page.getByText('CPF inválido')).toBeVisible();

      // Formato de email
      await page.getByPlaceholder('exemplo@email.com').fill('email-invalido');
      await page.getByRole('button', { name: 'Próximo' }).click();
      await expect(page.getByText('E-mail inválido')).toBeVisible();
    });
  });

  test.describe("Validações do Backend", () => {
    test("Deve mostrar erro de email duplicado após submit", async ({ page }) => {
      // Primeiro cadastro (bem-sucedido)
      await preencherPasso1(page);
      await page.getByRole('button', { name: 'Próximo' }).click();
      await preencherPasso2(page);
      await page.getByRole('button', { name: 'Finalizar Cadastro' }).click();
      await expect(page).toHaveURL(/\/cadastro\/confirmacao/);

      // Tentar cadastrar novamente com mesmo email
      await page.goto('/cadastro');
      await preencherPasso1(page);
      await page.getByRole('button', { name: 'Próximo' }).click();
      await preencherPasso2(page);
      await page.getByRole('button', { name: 'Finalizar Cadastro' }).click();

      // Verificar mensagem exata do backend
      await expect(page.getByText('Email já cadastrado no nosso sistema')).toBeVisible();
    });

    test("Deve validar CPF inválido no backend", async ({ page }) => {
      await preencherPasso1(page);
      // Forçar CPF inválido
      await page.getByPlaceholder('000.000.000-00').fill('111.111.111-11');
      await page.getByRole('button', { name: 'Próximo' }).click();
      await preencherPasso2(page);
      await page.getByRole('button', { name: 'Finalizar Cadastro' }).click();

      await expect(page.getByText('CPF não pode ter todos os números iguais')).toBeVisible();
    });

    test("Deve validar senha fraca no backend", async ({ page }) => {
      await preencherPasso1(page);
      // Forçar senha fraca
      await page.getByPlaceholder('Mínimo 8 caracteres').fill('senhafraca');
      await page.getByPlaceholder('Confirme sua senha').fill('senhafraca');
      await page.getByRole('button', { name: 'Próximo' }).click();
      await preencherPasso2(page);
      await page.getByRole('button', { name: 'Finalizar Cadastro' }).click();

      await expect(page.getByText('Senha deve ser composta por letras maiúsculas e minúsculas e caracteres especiais')).toBeVisible();
    });
  });

  // Funções auxiliares
  async function preencherPasso1(page: Page) {
    await page.getByText('Selecione').click();
    await page.getByText('Masculino').click();
    await page.getByPlaceholder('Maria Silva').fill(userData.nome);
    await page.getByPlaceholder('Data de nascimento').fill(userData.dataNascimento);
    await page.getByPlaceholder('000.000.000-00').fill(userData.cpf);
    await page.getByPlaceholder('(00) 00000-0000').fill(userData.telefone);
    await page.getByPlaceholder('exemplo@email.com').fill(userData.email);
    await page.getByPlaceholder('Mínimo 8 caracteres').fill(userData.senha);
    await page.getByPlaceholder('Confirme sua senha').fill(userData.senha);
  }

  async function preencherPasso2(page: Page) {
    await page.getByText('Selecione').click();
    await page.getByText('Casa').click();
    await page.getByPlaceholder('00000-000').fill('01001-000');
    await page.waitForTimeout(600);
    await page.getByPlaceholder('123').fill('100');
  }

  function gerarCPFValido(): string {
    // Função para gerar CPF válido
    const cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));

    // Cálculo do primeiro dígito verificador
    let soma = cpf.reduce((acc, val, idx) => acc + val * (10 - idx), 0);
    const dv1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    cpf.push(dv1);

    // Cálculo do segundo dígito verificador
    soma = cpf.reduce((acc, val, idx) => acc + val * (11 - idx), 0);
    const dv2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    cpf.push(dv2);

    return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function formatarData(data: Date): string {
    return data.toISOString().split('T')[0];
  }
});