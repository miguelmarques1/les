# Documento de Visão de Projeto

## Sistema de E-commerce para Livraria

### Histórico de Versões

| Data | Versão | Descrição | Autor | Revisor |
|------|--------|-----------|-------|---------|
| 10/06/2025 | 1.0 | Versão inicial do documento | Equipe de Desenvolvimento | - |

---

## Cliente
**Cliente:** Livraria Digital  
**Documento:** Documento de Visão de Projeto: Sistema de E-commerce para Livraria  
**Data:** 10 de junho de 2025  
**Autor:** Equipe de Desenvolvimento  

---

## Índice

1. [Objetivo](#1-objetivo)
2. [Escopo](#2-escopo)
3. [Necessidades de Negócio](#3-necessidades-de-negócio)
4. [Objetivo do Projeto](#4-objetivo-do-projeto)
5. [Declaração Preliminar de Escopo](#5-declaração-preliminar-de-escopo)
6. [Premissas](#6-premissas)
7. [Influência das Partes Interessadas](#7-influência-das-partes-interessadas)
8. [Representação Arquitetural](#8-representação-arquitetural)
9. [Visão de Use Case](#9-visão-de-use-case)
10. [Visão de Lógica](#10-visão-de-lógica)
11. [Visão de Implantação](#11-visão-de-implantação)
12. [Visão de Implementação](#12-visão-de-implementação)
13. [Visão de Dados](#13-visão-de-dados)
14. [Tamanho e Performance](#14-tamanho-e-performance)
15. [Qualidade](#15-qualidade)
16. [Cronograma Macro](#16-cronograma-macro)
17. [Referências](#17-referências)
18. [Regras de Negócio Críticas](#18-regras-de-negócio-críticas)
19. [Integração com IA Generativa](#19-integração-com-ia-generativa)

---

## 1. Objetivo

Este documento apresenta uma visão geral do sistema de e-commerce para livraria, desenvolvido como uma API REST robusta utilizando Node.js, Express.js e TypeORM. O sistema implementa uma arquitetura baseada em Domain-Driven Design (DDD) para garantir escalabilidade, manutenibilidade e separação clara de responsabilidades.

## 2. Escopo

O sistema abrange o desenvolvimento de uma API completa para e-commerce de livros, contemplando:

- **Gestão de Catálogo**: Cadastro e gerenciamento de livros, categorias, marcas e grupos de precificação
- **Gestão de Clientes**: Cadastro, autenticação, endereços e cartões de pagamento
- **Processo de Vendas**: Carrinho de compras, processamento de pedidos e transações
- **Controle de Estoque**: Entrada, saída e controle de disponibilidade de livros
- **Sistema de Trocas**: Solicitações e processamento de trocas e devoluções
- **Relatórios e Analytics**: Análise de vendas e recomendações com IA

### 2.1. Tecnologias Implementadas

**Backend:**
- Node.js com Express.js
- TypeScript para tipagem estática
- TypeORM para mapeamento objeto-relacional
- PostgreSQL como banco de dados
- JWT para autenticação
- bcrypt para criptografia de senhas

**Arquitetura:**
- Domain-Driven Design (DDD)
- Repository Pattern
- Factory Pattern
- Service Layer Pattern

## 3. Necessidades de Negócio

O sistema foi desenvolvido para atender às necessidades de uma livraria que deseja:

- Expandir suas vendas para o ambiente digital
- Automatizar o controle de estoque e precificação
- Oferecer uma experiência de compra moderna e segura
- Implementar estratégias de marketing digital (cupons, recomendações)
- Ter controle completo sobre pedidos, trocas e devoluções
- Gerar relatórios para tomada de decisões estratégicas

## 4. Objetivo do Projeto

Desenvolver uma API REST completa que possibilite:

- **Gestão Completa de Produtos**: Cadastro de livros com informações detalhadas, categorização e controle de estoque
- **Autenticação Segura**: Sistema robusto de login e autorização com JWT
- **Processo de Compra Completo**: Desde a adição ao carrinho até a finalização do pedido
- **Sistema de Pagamento**: Integração com múltiplas formas de pagamento e aplicação de cupons
- **Gestão de Trocas**: Processo completo de solicitação e aprovação de trocas/devoluções
- **Recomendações Inteligentes**: Sistema de recomendações baseado em IA generativa

## 5. Declaração Preliminar de Escopo

### 5.1. Descrição

O sistema é uma API REST desenvolvida em Node.js que fornece todos os endpoints necessários para um e-commerce de livros. A arquitetura segue princípios de DDD com separação clara entre domínio, aplicação e infraestrutura.

### 5.2. Produtos Entregues

- **API REST Completa**: Todos os endpoints implementados e documentados
- **Banco de Dados**: Estrutura completa com migrações e seeders
- **Documentação Técnica**: Especificações de API e arquitetura
- **Sistema de Autenticação**: JWT implementado com middleware de segurança
- **Testes**: Cobertura de testes unitários e de integração

### 5.3. Funcionalidades Implementadas

#### 5.3.1. Módulo de Autenticação
- Login com email e senha
- Geração e validação de tokens JWT
- Middleware de autenticação para rotas protegidas

#### 5.3.2. Módulo de Clientes
- Cadastro completo com validação de CPF
- Gerenciamento de múltiplos endereços
- Cadastro de múltiplos cartões de pagamento
- Atualização de dados pessoais

#### 5.3.3. Módulo de Catálogo
- Cadastro de livros com ISBN, categorias e precificação
- Busca avançada com filtros combinados
- Gestão de categorias e marcas
- Sistema de grupos de precificação

#### 5.3.4. Módulo de Vendas
- Carrinho de compras com bloqueio temporário de itens
- Processamento de pedidos com múltiplas formas de pagamento
- Aplicação de cupons de desconto
- Cálculo automático de frete

#### 5.3.5. Módulo de Estoque
- Entrada e saída de produtos
- Controle de disponibilidade em tempo real
- Precificação baseada em grupos de margem
- Histórico de movimentações

#### 5.3.6. Módulo de Trocas e Devoluções
- Solicitação de trocas com justificativa
- Workflow de aprovação/rejeição
- Controle de status das solicitações
- Reintegração ao estoque

## 6. Premissas

- O sistema será consumido por aplicações frontend (web e mobile)
- A infraestrutura de banco de dados PostgreSQL está disponível
- Serviços externos de pagamento possuem APIs REST disponíveis
- O sistema de IA generativa (Gemini) está configurado
- A equipe possui conhecimento em Node.js e TypeScript

## 7. Influência das Partes Interessadas

- **Desenvolvedores Frontend**: Necessitam de uma API bem documentada e consistente
- **Administradores do Sistema**: Precisam de endpoints para gestão de produtos e pedidos
- **Equipe de Marketing**: Requer funcionalidades de cupons e recomendações
- **Clientes Finais**: Esperam uma API rápida e confiável para suas compras

## 8. Representação Arquitetural

### 8.1. Arquitetura DDD Implementada

O sistema segue uma arquitetura em camadas baseada em Domain-Driven Design:

\`\`\`
src/
├── controllers/          # Camada de Apresentação
├── services/            # Camada de Aplicação
├── domain/              # Camada de Domínio
│   ├── entity/         # Entidades de negócio
│   ├── enums/          # Enumerações do domínio
│   ├── repositories/   # Contratos dos repositórios
│   ├── services/       # Serviços de domínio
│   ├── validation/     # Validações de negócio
│   └── vo/            # Value Objects
├── repositories/        # Camada de Infraestrutura
├── dto/                # Objetos de Transferência
├── factories/          # Factories para injeção de dependência
├── middlewares/        # Middlewares da aplicação
└── migration/          # Scripts de banco de dados
\`\`\`

### 8.2. Padrões Arquiteturais Utilizados

**Repository Pattern**: Abstração do acesso a dados
\`\`\`typescript
interface CustomerRepositoryInterface {
    store(entity: Customer): Promise<Customer>;
    find(params: FindCustomerParams): Promise<Customer | null>;
    findAll(query?: string): Promise<Customer[]>;
    update(id: number, entity: Customer): Promise<Customer>;
    delete(id: number): Promise<boolean>;
}
\`\`\`

**Factory Pattern**: Criação de repositórios
\`\`\`typescript
export class RepositoryFactory implements RepositoryFactoryInterface {
    createCustomerRepository(): CustomerRepositoryInterface {
        return new CustomerRepository(this.queryRunner);
    }
}
\`\`\`

**Service Layer**: Orquestração de casos de uso
\`\`\`typescript
export class CustomerService implements CustomerServiceInterface {
    public async store(input: CreateCustomerInputDTO): Promise<CustomerOutputDTO> {
        // Lógica de negócio
    }
}
\`\`\`

## 9. Visão de Use Case

### 9.1. Casos de Uso Principais

#### UC001 - Autenticação de Cliente
- **Ator**: Cliente
- **Descrição**: Login no sistema com email e senha
- **Endpoint**: `POST /api/auth/login`

#### UC002 - Cadastro de Cliente
- **Ator**: Cliente
- **Descrição**: Registro completo com dados pessoais, endereço e telefone
- **Endpoint**: `POST /api/customers`

#### UC003 - Busca de Livros
- **Ator**: Cliente
- **Descrição**: Busca no catálogo com filtros diversos
- **Endpoint**: `GET /api/stock?query={termo}`

#### UC004 - Gerenciamento de Carrinho
- **Ator**: Cliente
- **Descrição**: Adição, remoção e visualização de itens
- **Endpoints**: 
  - `GET /api/cart`
  - `POST /api/cart/add`
  - `DELETE /api/cart`

#### UC005 - Finalização de Pedido
- **Ator**: Cliente
- **Descrição**: Processo completo de checkout
- **Endpoint**: `POST /api/order`

#### UC006 - Solicitação de Troca
- **Ator**: Cliente
- **Descrição**: Solicitação de troca/devolução
- **Endpoint**: `POST /api/return-exchange-requests`

## 10. Visão de Lógica

### 10.1. Entidades Principais

**Customer**: Representa um cliente do sistema
\`\`\`typescript
export class Customer implements Entity {
    readonly document: Document;
    readonly status: UserStatus;
    readonly code: string;
    readonly password: Password | null;
    readonly gender: Gender;
    readonly birthdate: Date;
    // ... outros atributos
}
\`\`\`

**Book**: Representa um livro no catálogo
\`\`\`typescript
export class Book implements Entity {
    readonly isbn: ISBN;
    protected status: BookState;
    readonly categories: Category[];
    readonly precificationGroup: PrecificationGroup;
    // ... outros atributos
}
\`\`\`

**Order**: Representa um pedido
\`\`\`typescript
export class Order implements Entity {
    private status: OrderStatus;
    readonly items: OrderItem[] = [];
    readonly customerId: number;
    // ... outros atributos
}
\`\`\`

### 10.2. Value Objects

**Document**: CPF com validação
\`\`\`typescript
export class Document {
    public constructor(readonly value: string) {
        this.validate();
    }
    
    private validate() {
        // Validação de CPF
    }
}
\`\`\`

**ISBN**: Código ISBN com validação
\`\`\`typescript
export class ISBN {
    public value!: string;
    
    constructor(value: string) {
        this.setValue(value);
    }
    
    private validate() {
        // Validação de ISBN 10 e 13 dígitos
    }
}
\`\`\`

## 11. Visão de Implantação

### 11.1. Ambiente de Produção

- **Servidor de Aplicação**: Node.js em contêineres Docker
- **Banco de Dados**: PostgreSQL gerenciado
- **Proxy Reverso**: Nginx para balanceamento de carga
- **Monitoramento**: Logs estruturados e métricas de performance

### 11.2. Configuração de Ambiente

\`\`\`typescript
// data-source.ts
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: NODE_ENV === "dev" ? false : false,
  logging: NODE_ENV === "dev" ? true : false,
  migrations: [__dirname + "/migration/*.ts"],
});
\`\`\`

## 12. Visão de Implementação

### 12.1. Estrutura de Rotas

\`\`\`typescript
// routes/router.ts
Router.use("/customers", customerRouter);
Router.use("/auth", authRouter);
Router.use("/address", addressRouter);
Router.use("/card", cardRouter);
Router.use("/cart", cartRouter);
Router.use("/order", orderRouter);
Router.use("/stock", stockRouter);
Router.use("/return-exchange-requests", returnExchangeRouter);
\`\`\`

### 12.2. Middleware de Autenticação

\`\`\`typescript
export const authentification = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req['cus_id'] = decoded['id'];
    next(); 
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};
\`\`\`

## 13. Visão de Dados

### 13.1. Principais Tabelas

- **customers**: Dados dos clientes
- **books**: Catálogo de livros
- **orders**: Pedidos realizados
- **order_items**: Itens dos pedidos
- **stockbooks**: Controle de estoque
- **addresses**: Endereços dos clientes
- **cards**: Cartões de pagamento
- **coupons**: Cupons de desconto
- **return_exchange_requests**: Solicitações de troca

### 13.2. Relacionamentos Principais

- Customer 1:N Address
- Customer 1:N Card
- Customer 1:N Order
- Order 1:N OrderItem
- Book 1:N StockBook
- Book N:N Category

## 14. Tamanho e Performance

### 14.1. Métricas de Performance

- **Tempo de resposta**: < 2 segundos para operações comuns
- **Throughput**: Suporte a 1000+ requisições por minuto
- **Disponibilidade**: 99.9% uptime
- **Escalabilidade**: Horizontal via containers

### 14.2. Otimizações Implementadas

- Queries otimizadas com TypeORM
- Validações no nível de domínio
- Transações para operações críticas
- Índices no banco de dados

## 15. Qualidade

### 15.1. Aspectos de Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Validação de Entrada**: Sanitização de dados
- **Criptografia**: Senhas com bcrypt
- **Autorização**: Middleware de proteção de rotas

### 15.2. Tratamento de Erros

\`\`\`typescript
export abstract class BaseController {
  protected error(res: Response, error: any, statusCode: number = 500) {
    console.error("Error:", error);
    return res.status(error.statusCode ?? statusCode).json({
      data: null,
      error: true,
      message: error.message,
    });
  }
}
\`\`\`

## 16. Cronograma Macro

| Fase | Status | Descrição |
|------|--------|-----------|
| ✅ Arquitetura Base | Concluído | Estrutura DDD implementada |
| ✅ Domínio | Concluído | Entidades, VOs e validações |
| ✅ Autenticação | Concluído | JWT e middleware de segurança |
| ✅ Gestão de Clientes | Concluído | CRUD completo de clientes |
| ✅ Catálogo de Livros | Concluído | Busca e gestão de produtos |
| ✅ Carrinho e Vendas | Concluído | Processo completo de compra |
| ✅ Controle de Estoque | Concluído | Entrada/saída e precificação |
| ✅ Trocas e Devoluções | Concluído | Workflow completo |
| 🔄 IA Generativa | Em desenvolvimento | Recomendações personalizadas |
| 📋 Testes | Planejado | Cobertura de testes |

## 17. Referências

- **TypeORM Documentation**: https://typeorm.io/
- **Express.js Guide**: https://expressjs.com/
- **Domain-Driven Design**: Eric Evans
- **Clean Architecture**: Robert C. Martin
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

## 18. Regras de Negócio Críticas

### 18.1. Gestão de Estoque
- **RN001**: Validação de disponibilidade antes de adicionar ao carrinho
- **RN002**: Bloqueio temporário de itens no carrinho
- **RN003**: Baixa automática no estoque após confirmação de pagamento

### 18.2. Precificação
- **RN004**: Preço baseado no grupo de precificação e maior custo
- **RN005**: Aplicação de cupons com validação de regras
- **RN006**: Cálculo de frete baseado em peso e dimensões

### 18.3. Trocas e Devoluções
- **RN007**: Apenas itens entregues podem ser trocados
- **RN008**: Workflow de aprovação obrigatório
- **RN009**: Reintegração automática ao estoque após aprovação

## 19. Integração com IA Generativa

### 19.1. Sistema de Recomendações

O sistema implementa integração com Google Gemini para recomendações personalizadas:

\`\`\`typescript
export class AiService implements AiServiceInterface {
    public async getRecommendations(
        allBooks: Book[],
        userInterestBooks: Book[] = []
    ): Promise<AiResponseDTO> {
        // Implementação com Gemini AI
    }
}
\`\`\`

### 19.2. Funcionalidades de IA

- **Recomendações Personalizadas**: Baseadas no histórico de compras
- **Análise de Preferências**: Identificação de padrões de consumo
- **Sugestões Contextuais**: Recomendações por categoria e autor
- **Fallback Inteligente**: Sistema de recomendações quando IA não está disponível

---

**Documento:** Visão de Projeto - Sistema de E-commerce para Livraria  
**Versão:** 1.0  
**Data:** Janeiro 2025  
**Autor:** Equipe de Desenvolvimento  
**Tecnologia:** Node.js + Express.js + TypeORM + PostgreSQL
