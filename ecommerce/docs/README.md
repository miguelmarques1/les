# Documentação do Sistema de Livraria Online

Este diretório contém a documentação completa do sistema de e-commerce para livraria, incluindo especificações técnicas, casos de uso e visão arquitetural.

## Estrutura da Documentação

- **[Documento de Visão](./documento-visao.md)** - Visão geral do projeto, objetivos, escopo e arquitetura
- **[Caso de Uso - Vendas](./caso-uso-vendas.md)** - Especificação detalhada do processo de vendas
- **[Arquitetura do Sistema](./arquitetura.md)** - Detalhes técnicos da arquitetura implementada

## Tecnologias Utilizadas

### Backend
- **Node.js** com **Express.js** - Framework web
- **TypeScript** - Linguagem de programação
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas

### Arquitetura
- **Domain-Driven Design (DDD)** - Organização do código
- **Repository Pattern** - Acesso a dados
- **Factory Pattern** - Criação de objetos
- **Service Layer** - Lógica de negócio

## Como Usar Esta Documentação

1. Comece pelo [Documento de Visão](./documento-visao.md) para entender o contexto geral
2. Consulte os [Casos de Uso](./caso-uso-vendas.md) para entender os fluxos de negócio
3. Veja a [Arquitetura](./arquitetura.md) para detalhes técnicos de implementação

## Estrutura do Projeto

\`\`\`
src/
├── controllers/          # Controladores HTTP
├── services/            # Lógica de negócio
├── domain/              # Entidades e regras de domínio
│   ├── entity/         # Entidades do domínio
│   ├── enums/          # Enumerações
│   ├── repositories/   # Interfaces dos repositórios
│   └── validation/     # Validações de negócio
├── repositories/        # Implementações dos repositórios
├── dto/                # Data Transfer Objects
├── routes/             # Definição das rotas
├── middlewares/        # Middlewares da aplicação
├── migration/          # Scripts de migração do banco
└── seeders/           # Scripts de população inicial
