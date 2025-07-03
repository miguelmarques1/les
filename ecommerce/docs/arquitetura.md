# Arquitetura do Sistema - E-commerce de Livraria

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura DDD](#2-arquitetura-ddd)
3. [Estrutura de Pastas](#3-estrutura-de-pastas)
4. [Camadas da Aplicação](#4-camadas-da-aplicação)
5. [Padrões Implementados](#5-padrões-implementados)
6. [Entidades de Domínio](#6-entidades-de-domínio)
7. [Value Objects](#7-value-objects)
8. [Repositórios](#8-repositórios)
9. [Serviços](#9-serviços)
10. [Controladores](#10-controladores)
11. [Middleware](#11-middleware)
12. [Banco de Dados](#12-banco-de-dados)
13. [Integração com IA](#13-integração-com-ia)
14. [Segurança](#14-segurança)
15. [Testes](#15-testes)

---

## 1. Visão Geral

O sistema de e-commerce para livraria foi desenvolvido seguindo os princípios de **Domain-Driven Design (DDD)** com uma arquitetura em camadas bem definidas. A aplicação utiliza **Node.js** com **Express.js** como framework web, **TypeORM** para persistência de dados e **PostgreSQL** como banco de dados.

### 1.1. Tecnologias Principais

- **Runtime**: Node.js
- **Framework Web**: Express.js
- **Linguagem**: TypeScript
- **ORM**: TypeORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Criptografia**: bcrypt
- **IA**: Google Gemini

### 1.2. Princípios Arquiteturais

- **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **Inversão de Dependência**: Uso de interfaces para desacoplar camadas
- **Single Responsibility**: Classes com uma única responsabilidade
- **Domain-Driven Design**: Foco no domínio do negócio
- **Clean Architecture**: Dependências apontam para o centro (domínio)

## 2. Arquitetura DDD

A arquitetura segue os padrões do Domain-Driven Design, organizando o código em camadas concêntricas:

\`\`\`
┌─────────────────────────────────────┐
│           Infrastructure            │
│  ┌─────────────────────────────┐   │
│  │        Application          │   │
│  │  ┌─────────────────────┐   │   │
│  │  │      Domain         │   │   │
│  │  │   ┌─────────────┐   │   │   │
│  │  │   │   Entities  │   │   │   │
│  │  │   │     VOs     │   │   │   │
│  │  │   │   Services  │   │   │   │
│  │  │   └─────────────┘   │   │   │
│  │  └─────────────────────┘   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
\`\`\`

### 2.1. Camada de Domínio (Core)

Contém as regras de negócio puras, independente de tecnologia:

- **Entities**: Objetos com identidade única
- **Value Objects**: Objetos imutáveis sem identidade
- **Domain Services**: Lógica de domínio que não pertence a uma entidade
- **Repository Interfaces**: Contratos para persistência
- **Enums**: Enumerações do domínio

### 2.2. Camada de Aplicação

Orquestra casos de uso e coordena o domínio:

- **Services**: Implementam casos de uso específicos
- **DTOs**: Objetos de transferência de dados
- **Mappers**: Conversão entre objetos de diferentes camadas

### 2.3. Camada de Infraestrutura

Implementa detalhes técnicos e integrações:

- **Repositories**: Implementações concretas de persistência
- **Controllers**: Pontos de entrada HTTP
- **Middlewares**: Interceptadores de requisições
- **Database**: Configurações e migrações

## 3. Estrutura de Pastas

\`\`\`
src/
├── controllers/              # Camada de Apresentação
│   ├── base.controller.ts   # Controlador base
│   ├── auth.controller.ts   # Autenticação
│   ├── customer.controller.ts
│   ├── book.controller.ts
│   ├── cart.controller.ts
│   ├── order.controller.ts
│   └── ...
├── services/                # Camada de Aplicação
│   ├── customer.service.ts
│   ├── auth.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── ai.service.ts
│   └── ...
├── domain/                  # Camada de Domínio
│   ├── entity/             # Entidades
│   │   ├── Customer.ts
│   │   ├── Book.ts
│   │   ├── Order.ts
│   │   └── ...
│   ├── vo/                 # Value Objects
│   │   ├── Document.ts
│   │   ├── ISBN.ts
│   │   ├── Password.ts
│   │   └── ...
│   ├── enums/              # Enumerações
│   │   ├── UserStatus.ts
│   │   ├── OrderStatus.ts
│   │   └── ...
│   ├── repositories/       # Interfaces dos Repositórios
│   │   ├── CustomerRepositoryInterface.ts
│   │   ├── BookRepositoryInterface.ts
│   │   └── ...
│   ├── services/           # Serviços de Domínio
│   │   ├── CodeGenerator.ts
│   │   ├── FreightCalculator.ts
│   │   └── ...
│   ├── validation/         # Validações
│   │   └── DefaultValidation.ts
│   └── exceptions/         # Exceções de Domínio
│       ├── EntityValidationException.ts
│       └── ...
├── repositories/           # Implementações dos Repositórios
│   ├── CustomerRepository.ts
│   ├── BookRepository.ts
│   ├── OrderRepository.ts
│   └── ...
├── dto/                    # Data Transfer Objects
│   ├── customer.dto.ts
│   ├── book.dto.ts
│   ├── order.dto.ts
│   └── ...
├── mapper/                 # Mapeadores
│   ├── CustomerMapper.ts
│   ├── BookMapper.ts
│   └── ...
├── factories/              # Factories
│   ├── RepositoryFactory.ts
│   └── RepositoryFactoryInterface.ts
├── middlewares/            # Middlewares
│   ├── authentication.middleware.ts
│   ├── authorization.middleware.ts
│   └── error.middleware.ts
├── routes/                 # Definição de Rotas
│   ├── router.ts
│   ├── customer.routes.ts
│   ├── auth.routes.ts
│   └── ...
├── migration/              # Migrações do Banco
├── seeders/               # Dados Iniciais
├── helpers/               # Utilitários
├── exceptions/            # Exceções Globais
└── data-source.ts         # Configuração do Banco
\`\`\`

## 4. Camadas da Aplicação

### 4.1. Camada de Apresentação (Controllers)

Responsável por receber requisições HTTP e retornar respostas:

\`\`\`typescript
export class CustomerController extends BaseController {
    private customerService: CustomerServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.customerService = new CustomerService(repositoryFactory);
    }

    async store(req: Request, res: Response): Promise<any> {
        try {
            const input: CreateCustomerInputDTO = req.body;
            const output = await this.customerService.store(input);
            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
\`\`\`

### 4.2. Camada de Aplicação (Services)

Implementa casos de uso e orquestra operações:

\`\`\`typescript
export class CustomerService implements CustomerServiceInterface {
    private customerRepository: CustomerRepositoryInterface;
    private addressService: AddressServiceInterface;
    private phoneService: PhoneServiceInterface;
    private transaction: Transaction;

    public async store(input: CreateCustomerInputDTO): Promise<CustomerOutputDTO> {
        this.transaction.start();
        try {
            const entity = new Customer(/* parâmetros */);
            const customer = await this.customerRepository.store(entity);
            
            // Operações relacionadas
            await this.addressService.store(input.billing_address);
            await this.phoneService.store(input.phone);
            
            this.transaction.commit();
            return CustomerMapper.entityToOutputDTO(customer);
        } catch (e) {
            this.transaction.rollback();
            throw e;
        }
    }
}
\`\`\`

### 4.3. Camada de Domínio (Entities)

Contém as regras de negócio e validações:

\`\`\`typescript
export class Customer implements Entity {
    readonly document: Document;
    readonly status: UserStatus;
    readonly code: string;
    readonly password: Password | null;
    readonly gender: Gender;
    readonly birthdate: Date;

    constructor(
        readonly email: string,
        readonly name: string,
        birthdate: string,
        gender: string,
        document: string,
        readonly id: number | null = null,
        // ... outros parâmetros
    ) {
        this.document = new Document(document);
        this.status = status ? fromValue(UserStatus, status) : UserStatus.ACTIVE;
        this.birthdate = new Date(birthdate);
        this.code = code ?? CodeGenerator.generate("CUS");
        this.password = password ? new Password(password) : null;
        this.gender = fromValue(Gender, gender);
        this.validate();
    }

    private validate() {
        DefaultValidation.strDefaultLenght(this.name, "Nome deve ter no mínimo 2 caracteres");
        DefaultValidation.strIsEmail(this.email, "Email inválido");
        DefaultValidation.notNull(this.document, "Documento não pode ser nulo");
        // ... outras validações
    }
}
\`\`\`

### 4.4. Camada de Infraestrutura (Repositories)

Implementa persistência de dados:

\`\`\`typescript
export class CustomerRepository implements CustomerRepositoryInterface {
    private dataSource: QueryRunner;

    constructor(dataSource: QueryRunner) {
        this.dataSource = dataSource;
    }

    async store(entity: Customer): Promise<Customer> {
        const query = `
            INSERT INTO customers (
                cus_code, cus_status, cus_password, cus_email, 
                cus_gender, cus_name, cus_birthdate, cus_document, 
                cus_ranking, cus_created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING *;
        `;

        const values = [
            entity.code,
            entity.status,
            entity.password?.value ?? null,
            entity.email,
            entity.gender,
            entity.name,
            entity.birthdate,
            entity.document.value,
            entity.ranking ?? 0,
        ];

        const result = await this.dataSource.query(query, values);
        return result.length > 0 ? CustomerMapper.mapToEntity(result[0]) : null;
    }
}
\`\`\`

## 5. Padrões Implementados

### 5.1. Repository Pattern

Abstrai o acesso a dados através de interfaces:

\`\`\`typescript
export interface CustomerRepositoryInterface extends EntityRepositoryInterface<Customer, FindCustomerParams> {
    // Métodos específicos do Customer
}

export class CustomerRepository implements CustomerRepositoryInterface {
    // Implementação concreta
}
\`\`\`

### 5.2. Factory Pattern

Cria instâncias de repositórios:

\`\`\`typescript
export class RepositoryFactory implements RepositoryFactoryInterface {
    private queryRunner: QueryRunner;

    createCustomerRepository(): CustomerRepositoryInterface {
        return new CustomerRepository(this.queryRunner);
    }

    createOrderRepository(): OrderRepositoryInterface {
        return new OrderRepository(this.queryRunner);
    }
}
\`\`\`

### 5.3. Service Layer Pattern

Encapsula lógica de negócio:

\`\`\`typescript
export interface CustomerServiceInterface {
    store(input: CreateCustomerInputDTO): Promise<CustomerOutputDTO>;
    index(id: number): Promise<CustomerOutputDTO>;
    update(id: number, input: UpdateCustomerInputDTO): Promise<CustomerOutputDTO>;
}
\`\`\`

### 5.4. DTO Pattern

Transfere dados entre camadas:

\`\`\`typescript
export class CustomerOutputDTO {
    public constructor(
        public id: number,
        public name: string,
        public email: string,
        public gender: string,
        public birthdate: Date,
        public document: string,
        public ranking: number,
        public code: string, 
        public status: string,
    ) { }
}
\`\`\`

### 5.5. Mapper Pattern

Converte entre objetos de diferentes camadas:

\`\`\`typescript
export class CustomerMapper {
    static mapToEntity(row: any): Customer {
        return new Customer(
            row.cus_email,
            row.cus_name,
            row.cus_birthdate,
            row.cus_gender,
            row.cus_document,
            row.cus_id,
            row.cus_ranking,
            row.cus_password,
            row.cus_code,
            row.cus_status
        );
    }

    static entityToOutputDTO(customer: Customer): CustomerOutputDTO {
        return new CustomerOutputDTO(
            customer.id,
            customer.name,
            customer.email,
            customer.gender,
            customer.birthdate,
            customer.document.value,
            customer.ranking,
            customer.code,
            customer.status
        );
    }
}
\`\`\`

## 6. Entidades de Domínio

### 6.1. Customer (Cliente)

\`\`\`typescript
export class Customer implements Entity {
    readonly document: Document;      // CPF validado
    readonly status: UserStatus;      // ACTIVE/INACTIVE
    readonly code: string;           // Código único gerado
    readonly password: Password;     // Senha criptografada
    readonly gender: Gender;         // MALE/FEMALE/OTHER
    readonly birthdate: Date;        // Data de nascimento
    
    // Validações no construtor
    private validate() {
        DefaultValidation.strDefaultLenght(this.name, "Nome inválido");
        DefaultValidation.strIsEmail(this.email, "Email inválido");
        DefaultValidation.dateNotAfterToday(this.birthdate, "Data inválida");
    }
}
\`\`\`

### 6.2. Book (Livro)

\`\`\`typescript
export class Book implements Entity {
    readonly isbn: ISBN;                    // ISBN validado
    protected status: BookState;           // ACTIVE/INACTIVE
    readonly categories: Category[];       // Categorias do livro
    readonly precificationGroup: PrecificationGroup; // Grupo de precificação
    
    addCategories(categories: Category[]): Category[] {
        categories.forEach(category => {
            this.categories.push(category);
        });
        return this.categories;
    }
    
    setState(state: BookState): void {
        this.status = state;
    }
}
\`\`\`

### 6.3. Order (Pedido)

\`\`\`typescript
export class Order implements Entity {
    private status: OrderStatus;           // Status do pedido
    readonly items: OrderItem[] = [];     // Itens do pedido
    readonly customerId: number;          // ID do cliente
    protected address: Address | null;    // Endereço de entrega
    
    public setStatus(newStatusStr: string) {
        const newStatus = fromValue(OrderStatus, newStatusStr);
        this.validateStatusTransition(this.status, newStatus);
        this.status = newStatus;
    }
    
    private validateStatusTransition(current: OrderStatus, newStatus: OrderStatus): void {
        // Validação de transições válidas de status
    }
}
\`\`\`

### 6.4. StockBook (Livro em Estoque)

\`\`\`typescript
export class StockBook implements Entity {
    protected status: StockBookStatus;    // AVAILABLE/SOLD/BLOCKED
    readonly code: string;               // Código único
    protected book: Book | null;         // Livro associado
    protected saleDate: Date | null;     // Data de venda
    
    public sold() {
        this.status = StockBookStatus.SOLD;
        this.saleDate = new Date();
    }
    
    public getPrice(): number {
        if(!this.book) return 0;
        const higherCost = this.higherCostsValue;
        const profitPercentage = this.book.precificationGroup.profitPercentage;
        return higherCost + higherCost * (profitPercentage / 100);
    }
}
\`\`\`

## 7. Value Objects

### 7.1. Document (CPF)

\`\`\`typescript
export class Document {
    public constructor(readonly value: string) {
        this.validate();
    }

    private validate() {
        const document = this.value;
        if (!document) {
            throw new EntityValidationException('CPF não pode ser nulo ou vazio');
        }

        const parsedDocument = this.removeNonNumericChars(document);
        DefaultValidation.strHasLength(parsedDocument, 11, 'CPF deve conter exatamente 11 números');
        
        // Validação de dígitos verificadores
        const numbers = parsedDocument.split('').map(numberStr => Number.parseInt(numberStr));
        const firstVerifierDigit = this.calculateVerifierDigit(numbers.slice(0, 9), 10);
        const secondVerifierDigit = this.calculateVerifierDigit(numbers.slice(0, 10), 11);

        if (`${firstVerifierDigit}${secondVerifierDigit}` !== parsedDocument.substring(9, 11)) {
            throw new EntityValidationException('CPF inválido');
        }
    }
}
\`\`\`

### 7.2. ISBN

\`\`\`typescript
export class ISBN {
    public value!: string;

    constructor(value: string) {
        this.setValue(value);
    }

    private validate() {
        if(!this.value.startsWith("ISBN ")) 
            throw new EntityValidationException("Invalid ISBN");
            
        const parsedValue = this.removeCharacters(this.value);
        const isValid = parsedValue.length === 10 
            ? this.tenDigitsValidation(parsedValue) 
            : this.thirteenDigitsValidation(parsedValue); 
            
        if(!isValid) 
            throw new EntityValidationException("Invalid ISBN");
    }
}
\`\`\`

### 7.3. Password

\`\`\`typescript
export class Password {
    readonly value: string;

    public constructor(value: string) {
        if (this.isEncrypted(value)) {
            this.value = value;
        } else {
            this.validate(value);
            this.value = encrypt.encryptpass(value);
        }
    }

    private validate(value: string) {
        DefaultValidation.notNull(value, 'Senha é obrigatória');
        DefaultValidation.strHasMinLength(value, 8, 'Senha deve ter no mínimo 8 caracteres');
        DefaultValidation.strIsValidPassword(value, 'Senha deve ser composta por letras maiúsculas e minúsculas e caracteres especiais');
    }

    private isEncrypted(value: string): boolean {
        return value.startsWith("$2b$") || value.startsWith("$2a$");
    }
}
\`\`\`

## 8. Repositórios

### 8.1. Interface Base

\`\`\`typescript
export interface EntityRepositoryInterface<T extends Entity, Y extends FindParams> {
    store(entity: T): Promise<T>;
    find(params: Y): Promise<T | null>;
    findAll(query?: string): Promise<T[]>;
    update(id: number, entity: T): Promise<T>;
    delete(id: number): Promise<boolean>;
}
\`\`\`

### 8.2. Implementação com TypeORM

\`\`\`typescript
export class CustomerRepository implements CustomerRepositoryInterface {
    private dataSource: QueryRunner;

    constructor(dataSource: QueryRunner) {
        this.dataSource = dataSource;
    }

    async find(params: FindCustomerParams): Promise<Customer | null> {
        const queryParts: string[] = [];
        const queryParams: (string | number)[] = [];
        let counter = 1;
    
        if (params.id) {
            queryParts.push(`cus_id = $${counter}`);
            queryParams.push(params.id);
            counter++;
        }
    
        if (params.email) {
            queryParts.push(`cus_email = $${counter}`);
            queryParams.push(params.email);
            counter++;
        }
    
        if (queryParts.length === 0) {
            return null;
        }
    
        const query = `SELECT * FROM customers WHERE ${queryParts.join(' OR ')}`;
        const result = await this.dataSource.query(query, queryParams);

        return result.length > 0 ? CustomerMapper.mapToEntity(result[0]) : null;
    }
}
\`\`\`

## 9. Serviços

### 9.1. Serviços de Aplicação

\`\`\`typescript
export class OrderService implements OrderServiceInterface {
    private addressService: AddressServiceInterface;
    private cardService: CardServiceInterface;
    private couponService: CouponServiceInterface;
    private cartService: CartServiceInterface;
    private dbTransaction: Transaction;

    async store(input: CreateOrderInputDTO): Promise<OrderOutputDTO> {
        this.dbTransaction.start();
        try {
            const { order, transaction } = await this.prepareOrderData(input);
            const savedOrder = await this.orderRepository.store(order);
            
            await this.storeOrderItems(savedOrder.id, input.customer_id);
            await this.storeTransaction(transaction, savedOrder.id);
            await this.cartService.clear(input.customer_id);
            
            this.dbTransaction.commit();
            return this.getFullOrderDetails(savedOrder.id);
        } catch (e) {
            this.dbTransaction.rollback();
            throw e;
        }
    }
}
\`\`\`

### 9.2. Serviços de Domínio

\`\`\`typescript
export class DefaultFreightCalculator implements FreightCalculator {
    private static readonly MIN_FREIGHT_COST = 10;

    calculate(book: Book): number {
        const volume = (book.height * book.width * book.depth) / 100; 
        const freight = volume * book.weight * 0.1; 

        return Math.max(freight, DefaultFreightCalculator.MIN_FREIGHT_COST);
    }
}
\`\`\`

## 10. Controladores

### 10.1. Controlador Base

\`\`\`typescript
export abstract class BaseController {
    protected success(res: Response, data: any, statusCode: number = 200) {
        return res.status(statusCode).json({
            data: data,
            error: false,
            message: null,
        });
    }

    protected error(res: Response, error: any, statusCode: number = 500) {
        console.error("Error:", error);
        console.error("Stack Trace:", error.stack);
        return res.status(error.statusCode ?? statusCode).json({
            data: null,
            error: true,
            message: error.message,
        });
    }
}
\`\`\`

### 10.2. Controladores Específicos

\`\`\`typescript
export class OrderController extends BaseController {
    private orderService: OrderServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.orderService = new OrderService(repositoryFactory);
    }

    async store(req: Request, res: Response) {
        try {
            const customerId = parseInt(req['cus_id']);
            const input: CreateOrderInputDTO = req.body;
            input.customer_id = customerId;

            const output = await this.orderService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
\`\`\`

## 11. Middleware

### 11.1. Autenticação JWT

\`\`\`typescript
export const authentification = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const header = req.headers.authorization;
    
    if (!header) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const token = header.split(" ")[1];
    
    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req['cus_id'] = decoded['id'];
        next(); 
    } catch (err) {
        res.status(401).send("Unauthorized" + err.message);
        return;
    }
};
\`\`\`

### 11.2. Tratamento de Erros

\`\`\`typescript
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
};
\`\`\`

## 12. Banco de Dados

### 12.1. Configuração TypeORM

\`\`\`typescript
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
    subscribers: [],
});
\`\`\`

### 12.2. Migrações

\`\`\`typescript
export class CreateCustomersTable1738086234762 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE customer_status AS ENUM ('ACTIVE', 'INACTIVE');
            CREATE TYPE customer_gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
      
            CREATE TABLE customers (
              cus_id SERIAL PRIMARY KEY,
              cus_code VARCHAR(255) UNIQUE NOT NULL,
              cus_status customer_status NOT NULL,
              cus_password VARCHAR(255) NOT NULL,
              cus_email VARCHAR(255) UNIQUE NOT NULL,
              cus_gender customer_gender NOT NULL,
              cus_name VARCHAR(255) NOT NULL,
              cus_birthdate DATE NOT NULL,
              cus_document VARCHAR(14) UNIQUE NOT NULL,
              cus_ranking INTEGER NOT NULL,
              cus_created_at DATE NOT NULL DEFAULT CURRENT_DATE
          );
        `);
    }
}
\`\`\`

### 12.3. Seeders

\`\`\`typescript
export class BookSeeder extends Seeder {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "books" (
                "bok_status", "pgp_id", "bok_author", "bok_year", 
                "bok_title", "bok_publisher", "bok_edition", "bok_isbn", 
                "bok_pages", "bok_synopsis", "bok_height", "bok_width", 
                "bok_weight", "bok_depth"
            ) VALUES
            ('ACTIVE', 1, 'J.K. Rowling', 1997, 'Harry Potter and the Philosopher''s Stone', 'Bloomsbury', 1, 'ISBN 9780747532699', 223, 'A young wizard embarks on a journey to defeat a dark force.', 20.0, 15.0, 0.5, 2.0);
        `);
    }
}
\`\`\`

## 13. Integração com IA

### 13.1. Serviço de IA

\`\`\`typescript
export class AiService implements AiServiceInterface {
    private readonly genAI: GoogleGenAI;
    private readonly model: string;

    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY environment variable is not set");
        }

        this.genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    }

    public async getRecommendations(
        allBooks: Book[],
        userInterestBooks: Book[] = []
    ): Promise<AiResponseDTO> {
        try {
            const prompt = this.buildPrompt(allBooks, userInterestBooks);
            const response = await this.getAIResponse(prompt);
            const recommendedIds = this.parseResponse(response);
            const validRecommendations = this.validateRecommendations(recommendedIds, allBooks);

            return new AiResponseDTO(validRecommendations);
        } catch (error) {
            console.error("AI Recommendation Error:", error);
            return this.getFallbackRecommendations(allBooks);
        }
    }
}
\`\`\`

## 14. Segurança

### 14.1. Criptografia de Senhas

\`\`\`typescript
export class encrypt {
    static encryptpass(password: string): string {
        return bcrypt.hashSync(password, 12);
    }
    
    static async comparepassword(hashPassword: string, password: string): Promise<boolean> {
        return bcrypt.compareSync(password, hashPassword);
    }

    static generateToken(payload: authPayload) {
        return jwt.sign(payload, JWT_SECRET);
    }
}
\`\`\`

### 14.2. Validações de Domínio

\`\`\`typescript
export class DefaultValidation {
    public static notNull(value: any, exceptMessage: string) {
        if(!value) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strIsEmail(value: string, exceptMessage: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new EntityValidationException(exceptMessage);
        }
    }

    public static strIsValidPassword(value: string, exceptMessage: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(value)) {
            throw new EntityValidationException(exceptMessage);
        }
    }
}
\`\`\`

## 15. Testes

### 15.1. Estrutura de Testes

\`\`\`typescript
// Configuração de teste
export const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username:'postgres',
    password: 'password',
    database: 'test_db',
    synchronize: true,
    logging: false,
    migrationsRun: true,
    migrations: ['src/migration/*.ts'],
});
\`\`\`

### 15.2. Repositórios em Memória

\`\`\`typescript
export class CustomerRepositoryMemory implements CustomerRepositoryInterface {
    private customers: Customer[] = [];

    async store(entity: Customer): Promise<Customer> {
        const newCustomer = new Customer(
            entity.email,
            entity.name,
            entity.birthdate.toDateString(),
            entity.gender,
            entity.document.value,
            this.customers.length + 1,
            entity.ranking ?? 0,
            entity.password.value ?? "defaultPassword",
            entity.code ?? `CUS00${this.customers.length + 1}`,
            entity.status ?? UserStatus.ACTIVE
        );

        this.customers.push(newCustomer);
        return Promise.resolve(newCustomer);
    }
}
\`\`\`

---

**Documento:** Arquitetura do Sistema - E-commerce de Livraria  
**Versão:** 1.0  
**Data:** Janeiro 2025  
**Autor:** Equipe de Desenvolvimento  
**Tecnologia:** Node.js + Express.js + TypeORM + PostgreSQL  
**Padrão:** Domain-Driven Design (DDD)
