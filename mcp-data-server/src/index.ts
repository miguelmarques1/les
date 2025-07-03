import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Book, Category } from "./models/interfaces";
import { AllBooksSchema, AllCategoriesSchema, BookCategorySchema, CustomerInterestSchema } from './schemas'; // Ajuste o caminho para seus schemas compartilhados
import { RepositoryFactory } from "./factories/RepositoryFactory";

const repositoryFactory = new RepositoryFactory();
const bookRepository = repositoryFactory.getBookRepository();
const categoryRepository = repositoryFactory.getCategoryRepository();

const server = new McpServer({
    name: "book-data-mcp-server",
    version: "1.0.0"
});

async function getAllAvailableBooksImpl({ }, extra: any): Promise<any> {
    const books: Book[] = await bookRepository.getAllBooks();
    return { content: [{ type: "text", text: JSON.stringify(books) }] };
}

async function searchBooksByCategoryImpl({ categoryID }: { categoryID: number }): Promise<any> {
    const books: Book[] = await bookRepository.searchBooksByCategory(categoryID);
    return { content: [{ type: "text", text: JSON.stringify(books) }] };
}

async function getCustomerInterestBooksImpl({ customerID }: { customerID: number }): Promise<any> {
    const books: Book[] = await bookRepository.getCustomerInterestBooks(customerID);
    return { content: [{ type: "text", text: JSON.stringify(books) }] };
}

async function getAllCategoriesImpl({ }): Promise<any> {
    const categories: Category[] = await categoryRepository.getAllCategories();
    return { content: [{ type: "text", text: JSON.stringify(categories) }] };
}

server.registerTool("get_all_available_books",
    {
        title: "Get All Available Books",
        description: "Retrieves a list of all available books from the system.",
        inputSchema: AllBooksSchema,
    },
    getAllAvailableBooksImpl
);

server.registerTool("search_books_by_category",
    {
        title: "Search Books by Category",
        description: "Searches for books available in the system based on a specific category name (e.g., 'Fiction', 'Fantasy').",
        inputSchema: BookCategorySchema,
    },
    searchBooksByCategoryImpl
);

server.registerTool("get_customer_interest_books",
    {
        title: "Get Customer Interest Books",
        description: "Retrieves a list of books that a specific customer has shown interest in or previously interacted with.",
        inputSchema: CustomerInterestSchema,
    },
    getCustomerInterestBooksImpl
);

server.registerTool("get_all_categories",
    {
        title: "Get All Categories",
        description: "Retrieves a list of all available book categories in the system.",
        inputSchema: AllCategoriesSchema,
    },
    getAllCategoriesImpl
);

const transport = new StdioServerTransport();
server.connect(transport);

console.log("Servidor MCP escutando requisições via Stdio...");

process.on('SIGTERM', () => {
    console.log('Servidor MCP desconectando');
    server.close();
    process.exit(0);
});