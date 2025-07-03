import { AuthOutputDTO } from "../dto/auth.dto";
import { BookCategoryOverviewOutputDTO, DashboardDataOutputDTO, DashboardSummaryOutputDTO, MonthlySalesOutputDTO } from "../dto/dashboard.dto";
import { OrderOutputDTO } from "../dto/order.dto";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { encrypt } from "../helpers/encrypt";
import { BookService, BookServiceInterface } from "./book.service";
import { CategoryService, CategoryServiceInterface } from "./category.service";
import { OrderService, OrderServiceInterface } from "./order.service";

export interface AdminServiceInterface {
    authenticate(email: string, password: string): Promise<AuthOutputDTO>;
    dashboard(): Promise<DashboardDataOutputDTO>;
}

export class AdminService implements AdminServiceInterface {
    private bookService: BookServiceInterface;
    private orderService: OrderServiceInterface;
    private categoryService: CategoryServiceInterface;
    
    public constructor(repositoryFactory: RepositoryFactory) {
        this.bookService = new BookService(repositoryFactory);
        this.orderService = new OrderService(repositoryFactory);
        this.categoryService = new CategoryService(repositoryFactory);
    }
    
    public async authenticate(email: string, password: string): Promise<AuthOutputDTO> {
        if (!(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)) {
            throw new Error("Invalid credentials");
        } 

        const accessToken = encrypt.generateToken({
            id: "admin",
            role: "admin",
        });
        return new AuthOutputDTO(accessToken);
    }
    
    public async dashboard(): Promise<DashboardDataOutputDTO> {
        const summary = await this.summary();
        const salesData = await this.salesData();
        const recentOrders = await this.recentOrders();
        const categoryOverview = await this.categoryOverview();

        return new DashboardDataOutputDTO(
            summary,
            salesData,
            recentOrders,
            categoryOverview
        );
    }

    private async summary(): Promise<DashboardSummaryOutputDTO> {
        const lowStockCount = await this.bookService.lowStockCount();
        const itemsCount = await this.bookService.itemsCount();
        const totalSales = await this.orderService.totalSales();
        const totalOrders = await this.orderService.totalOrders();
        const averageOrderValue = await this.orderService.averageOrderValue();

        return new DashboardSummaryOutputDTO(
            totalSales,
            totalSales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            totalOrders,
            averageOrderValue,
            averageOrderValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            itemsCount,
            lowStockCount
        );
    }
    
    private async salesData(): Promise<MonthlySalesOutputDTO[]> {
        return this.orderService.monthlySales();
    }
    
    private async recentOrders(): Promise<OrderOutputDTO[]> {
        return this.orderService.getRecentOrders();
    }

    private async categoryOverview(): Promise<BookCategoryOverviewOutputDTO[]> {
        return this.categoryService.overview();
    }
}