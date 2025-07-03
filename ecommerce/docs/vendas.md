# ESPECIFICAÇÃO DE CASO DE USO - SISTEMA DE LIVRARIA

## Índice

1. [NOME DO CASO DE USO](#1-nome-do-caso-de-uso)
2. [OBJETIVO](#2-objetivo)
3. [DESCRIÇÃO](#3-descrição)
4. [REQUISITOS FUNCIONAIS](#4-requisitos-funcionais)
5. [TIPO DE CASO DE USO](#5-tipo-de-caso-de-uso)
6. [ATORES](#6-atores)
7. [PRÉ-CONDIÇÕES](#7-pré-condições)
8. [FLUXO PRINCIPAL](#8-fluxo-principal)
9. [FLUXOS ALTERNATIVOS](#9-fluxos-alternativos)
10. [FLUXOS DE EXCEÇÃO](#10-fluxos-de-exceção)
11. [ENDPOINTS DA API](#11-endpoints-da-api)
12. [PÓS-CONDIÇÕES](#12-pós-condições)
13. [REQUISITOS NÃO-FUNCIONAIS](#13-requisitos-não-funcionais)
14. [PONTO DE EXTENSÃO](#14-ponto-de-extensão)
15. [CRITÉRIOS DE ACEITE](#15-critérios-de-aceite)
16. [OBSERVAÇÕES](#16-observações)
17. [REFERÊNCIAS](#17-referências)

---

## 1. Nome do Caso de Uso

**CDU02 – Realizar Venda de Livros via API REST**

## 2. Objetivo

Este caso de uso tem como objetivo especificar o processo completo de venda de livros através da API REST, incluindo autenticação, gerenciamento do carrinho de compras, aplicação de cupons de desconto, processamento de pagamento e finalização do pedido.

## 3. Descrição

O processo de venda de livros é implementado através de uma API REST robusta que permite que aplicações cliente (web, mobile) consumam os serviços de e-commerce. O sistema oferece endpoints para todas as etapas do processo de compra, desde a busca de produtos até o acompanhamento de pedidos.

A API implementa autenticação JWT, validações de negócio rigorosas, controle de estoque em tempo real e integração com sistemas de pagamento. Todas as operações são auditadas e o sistema mantém consistência de dados através de transações.

## 4. Requisitos Funcionais

- **RF0031** – Gerenciar carrinho de compra via API
- **RF0032** – Definir quantidade de itens no carrinho
- **RF0033** – Realizar compra através de endpoint
- **RF0034** – Calcular frete automaticamente
- **RF0035** – Selecionar endereço de entrega cadastrado
- **RF0036** – Selecionar forma de pagamento cadastrada
- **RF0037** – Finalizar Compra via transação
- **RF0038** – Processar pagamento com gateway externo
- **RF0039** – Atualizar status de entrega
- **RF0040** – Solicitar troca via API
- **RF0041** – Autorizar trocas através de workflow
- **RF0042** – Visualização de trocas por cliente
- **RF0043** – Confirmar recebimento de itens para troca
- **RF0044** – Gerar cupom de troca automaticamente

## 5. Tipo de Caso de Uso

☑️ **Concreto** (Iniciado diretamente por requisições HTTP)  
☐ **Abstrato** (Não iniciado diretamente por um Ator)

## 6. Atores

| Nome | Tipo | Primário | Secundário |
|------|------|----------|------------|
| Cliente (via App) | Sistema | ☑️ | ☐ |
| Sistema de Pagamento | Sistema | ☐ | ☑️ |
| Sistema de Estoque | Sistema | ☐ | ☑️ |
| IA de Recomendações | Sistema | ☐ | ☑️ |

## 7. Pré-condições

### 7.1. Autenticação de Usuário
O cliente deve estar autenticado com token JWT válido para acessar endpoints protegidos.

### 7.2. Disponibilidade de Produtos
Os produtos devem estar disponíveis em estoque (status AVAILABLE) para serem adicionados ao carrinho.

### 7.3. Dados Cadastrais
O cliente deve possuir pelo menos um endereço de entrega e um cartão de pagamento cadastrado.

### 7.4. Configuração do Sistema
- Banco de dados PostgreSQL configurado e acessível
- Serviços de IA (Gemini) configurados para recomendações
- Variáveis de ambiente configuradas (JWT_SECRET, DATABASE_URL, etc.)

## 8. Fluxo Principal

### P1. Autenticação do Cliente
**P1.1.** Cliente envia credenciais via `POST /api/auth/login`
\`\`\`json
{
  "email": "cliente@email.com",
  "password": "senha123",
  "role": "customer"
}
\`\`\`
**P1.2.** Sistema valida credenciais e retorna token JWT
**P1.3.** Cliente inclui token no header Authorization para próximas requisições

### P2. Busca e Seleção de Produtos
**P2.1.** Cliente busca livros via `GET /api/stock?query={termo}`
**P2.2.** Sistema retorna catálogo com informações de preço e estoque
**P2.3.** Cliente visualiza detalhes do produto via `GET /api/stock/{id}`
**P2.4.** Sistema valida disponibilidade em estoque antes de permitir adição

### P3. Gerenciamento do Carrinho
**P3.1.** Cliente adiciona produtos ao carrinho via `POST /api/cart/add`
\`\`\`json
{
  "book_id": 1,
  "quantity": 2
}
\`\`\`
**P3.2.** Sistema bloqueia temporariamente os itens (status BLOCKED)
**P3.3.** Cliente visualiza carrinho via `GET /api/cart`
**P3.4.** Sistema calcula totais e frete automaticamente

### P4. Aplicação de Cupons
**P4.1.** Cliente valida cupom via `POST /api/coupon/validate`
\`\`\`json
{
  "code": "DESCONTO10"
}
\`\`\`
**P4.2.** Sistema valida regras do cupom (validade, status, tipo)
**P4.3.** Sistema aplica desconto nos cálculos do carrinho

### P5. Finalização da Compra
**P5.1.** Cliente finaliza pedido via `POST /api/order`
\`\`\`json
{
  "address_id": 1,
  "card_id": 1,
  "coupon_code": "DESCONTO10"
}
\`\`\`
**P5.2.** Sistema inicia transação de banco de dados
**P5.3.** Sistema valida todos os dados (estoque, endereço, cartão)
**P5.4.** Sistema cria pedido com status "PROCESSING"
**P5.5.** Sistema processa pagamento e atualiza status
**P5.6.** Sistema confirma transação e limpa carrinho

## 9. Fluxos Alternativos

### A1. Cliente Não Autenticado
**Condição:** Token JWT inválido ou ausente

**A1.1.** Sistema retorna HTTP 401 Unauthorized
**A1.2.** Cliente deve realizar login via `POST /api/auth/login`
**A1.3.** Retorna ao passo P2 após autenticação

### A2. Produto Indisponível
**Condição:** Produto sem estoque durante adição ao carrinho

**A2.1.** Sistema retorna HTTP 404 com mensagem específica
**A2.2.** Sistema sugere produtos similares via IA
**A2.3.** Cliente pode escolher produto alternativo

### A3. Múltiplos Cartões de Pagamento
**Condição:** Cliente deseja dividir pagamento

**A3.1.** Cliente envia array de cartões no payload
\`\`\`json
{
  "cards": [
    {"card_id": 1, "amount": 50.00},
    {"card_id": 2, "amount": 30.00}
  ]
}
\`\`\`
**A3.2.** Sistema valida valor mínimo de R$ 10,00 por cartão
**A3.3.** Sistema processa múltiplas transações

### A4. Uso de Múltiplos Cupons
**Condição:** Cliente possui cupons de troca

**A4.1.** Sistema permite 1 cupom promocional + múltiplos cupons de troca
**A4.2.** Sistema valida cada cupom individualmente
**A4.3.** Sistema aplica descontos conforme regras de negócio

### A5. Recomendações Personalizadas
**Condição:** Cliente solicita recomendações

**A5.1.** Cliente acessa `GET /api/stock/recommendations`
**A5.2.** Sistema consulta IA com histórico do cliente
**A5.3.** Sistema retorna livros recomendados baseados em preferências

## 10. Fluxos de Exceção

### E1. Falha no Processamento do Pagamento
**E1.1.** Sistema detecta falha na transação de pagamento
**E1.2.** Sistema executa rollback da transação
**E1.3.** Sistema retorna HTTP 400 com detalhes do erro
**E1.4.** Sistema mantém carrinho para nova tentativa

### E2. Estoque Insuficiente Durante Checkout
**E2.1.** Sistema detecta alteração de estoque durante finalização
**E2.2.** Sistema executa rollback da transação
**E2.3.** Sistema retorna HTTP 409 com itens indisponíveis
**E2.4.** Sistema atualiza carrinho removendo itens indisponíveis

### E3. Cupom Expirado ou Inválido
**E3.1.** Sistema valida cupom e detecta problema
**E3.2.** Sistema retorna HTTP 400 com mensagem específica
\`\`\`json
{
  "error": true,
  "message": "Cupom expirado ou inválido"
}
\`\`\`
**E3.3.** Sistema remove cupom dos cálculos

### E4. Erro de Conectividade com Banco
**E4.1.** Sistema detecta falha de conexão
**E4.2.** Sistema retorna HTTP 500 Internal Server Error
**E4.3.** Sistema registra erro nos logs para investigação
**E4.4.** Sistema mantém estado consistente

### E5. Token JWT Expirado
**E5.1.** Middleware detecta token expirado
**E5.2.** Sistema retorna HTTP 401 Unauthorized
**E5.3.** Cliente deve renovar autenticação

### E6. Bloqueio de Itens Expirado
**E6.1.** Sistema remove itens do carrinho após timeout
**E6.2.** Sistema libera itens para outros clientes (status AVAILABLE)
**E6.3.** Sistema notifica cliente sobre expiração

## 11. Endpoints da API

### 11.1. Autenticação
\`\`\`
POST /api/auth/login
Content-Type: application/json
{
  "email": "string",
  "password": "string", 
  "role": "customer"
}
\`\`\`

### 11.2. Gestão de Clientes
\`\`\`
POST /api/customers          # Cadastro
GET /api/customers           # Dados do cliente logado
PUT /api/customers           # Atualização de dados
\`\`\`

### 11.3. Endereços
\`\`\`
GET /api/address             # Listar endereços
POST /api/address            # Cadastrar endereço
PUT /api/address/{id}        # Atualizar endereço
DELETE /api/address/{id}     # Remover endereço
\`\`\`

### 11.4. Cartões
\`\`\`
GET /api/card                # Listar cartões
POST /api/card               # Cadastrar cartão
DELETE /api/card/{id}        # Remover cartão
\`\`\`

### 11.5. Catálogo e Estoque
\`\`\`
GET /api/stock               # Buscar livros
GET /api/stock/{id}          # Detalhes do livro
GET /api/stock/recommendations # Recomendações IA
POST /api/stock              # Entrada em estoque (admin)
\`\`\`

### 11.6. Carrinho
\`\`\`
GET /api/cart                # Visualizar carrinho
POST /api/cart/add           # Adicionar item
DELETE /api/cart             # Remover itens
\`\`\`

### 11.7. Cupons
\`\`\`
POST /api/coupon/validate    # Validar cupom
\`\`\`

### 11.8. Pedidos
\`\`\`
POST /api/order              # Finalizar compra
GET /api/order               # Meus pedidos
PUT /api/order/{id}          # Atualizar status (admin)
GET /api/order/all           # Todos os pedidos (admin)
\`\`\`

### 11.9. Trocas e Devoluções
\`\`\`
POST /api/return-exchange-requests     # Solicitar troca
GET /api/return-exchange-requests      # Listar todas (admin)
GET /api/return-exchange-requests/my-requests # Minhas solicitações
PUT /api/return-exchange-requests/{id}/status # Atualizar status
\`\`\`

## 12. Pós-condições

### 12.1. Pedido Criado
O pedido é registrado no banco com status inicial "PROCESSING" e ID único gerado.

### 12.2. Estoque Atualizado
As quantidades dos produtos vendidos são alteradas de AVAILABLE para SOLD.

### 12.3. Transação Registrada
Todas as informações de pagamento são registradas na tabela transactions.

### 12.4. Carrinho Limpo
Itens do carrinho são removidos após finalização bem-sucedida.

### 12.5. Logs de Auditoria
Todas as operações são registradas para auditoria e troubleshooting.

## 13. Requisitos Não-Funcionais

- **RNF001** – Tempo de resposta para consultas (máximo 2 segundos)
- **RNF002** – Log completo de transações para auditoria
- **RNF003** – Autenticação JWT com expiração configurável
- **RNF004** – Validação rigorosa de entrada em todos os endpoints
- **RNF005** – Tratamento de erros padronizado com códigos HTTP apropriados
- **RNF006** – Suporte a CORS para integração com frontends
- **RNF007** – Rate limiting para prevenção de ataques
- **RNF008** – Criptografia de senhas com bcrypt
- **RNF009** – Transações de banco para operações críticas
- **RNF010** – Disponibilidade de 99.9%

## 14. Ponto de Extensão

- **PE01** – Integração com gateways de pagamento externos
- **PE02** – Webhook para notificações de status de pedido
- **PE03** – API de recomendações com machine learning avançado
- **PE04** – Integração com sistemas de logística
- **PE05** – API de analytics e relatórios
- **PE06** – Sistema de notificações push

## 15. Critérios de Aceite

1. **Autenticação**: Token JWT deve ser validado em todas as rotas protegidas
2. **Performance**: Endpoints devem responder em menos de 2 segundos
3. **Segurança**: Senhas devem ser criptografadas e dados sensíveis protegidos
4. **Consistência**: Operações de compra devem usar transações de banco
5. **Validação**: Todos os inputs devem ser validados no nível de domínio
6. **Estoque**: Controle de estoque deve ser atualizado em tempo real
7. **Auditoria**: Todas as operações devem ser logadas
8. **Recuperação**: Sistema deve se recuperar graciosamente de falhas

## 16. Observações

### 16.1. Implementação Atual

O sistema está implementado com:
- **Node.js + Express.js** para servidor HTTP
- **TypeORM** para mapeamento objeto-relacional
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **bcrypt** para criptografia de senhas
- **Arquitetura DDD** para organização do código

### 16.2. Padrões de Resposta

Todas as respostas seguem o padrão:
\`\`\`json
{
  "data": {},
  "error": false,
  "message": null
}
\`\`\`

Em caso de erro:
\`\`\`json
{
  "data": null,
  "error": true,
  "message": "Descrição do erro"
}
\`\`\`

### 16.3. Middleware de Autenticação

\`\`\`typescript
export const authentification = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req['cus_id'] = decoded['id'];
    next(); 
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};
\`\`\`

### 16.4. Considerações de Segurança

- Validação de entrada em todas as camadas
- Sanitização de dados para prevenir SQL Injection
- Rate limiting implementado
- HTTPS obrigatório em produção
- Logs de segurança para auditoria

## 17. Referências

- **Express.js Documentation**: https://expressjs.com/
- **TypeORM Documentation**: https://typeorm.io/
- **JWT Best Practices**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/
- **REST API Design**: https://restfulapi.net/
- **Node.js Security**: https://nodejs.org/en/docs/guides/security/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Documento:** CDU02 - Realizar Venda de Livros via API REST  
**Versão:** 1.0  
**Data:** Janeiro 2025  
**Autor:** Equipe de Desenvolvimento  
**Tecnologia:** Node.js + Express.js + TypeORM + PostgreSQL  
**Arquitetura:** Domain-Driven Design (DDD)
