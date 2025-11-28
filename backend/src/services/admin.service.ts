import { AuthOutputDTO } from "../dto/auth.dto";
import { BookCategoryOverviewOutputDTO, DashboardDataOutputDTO, DashboardSummaryOutputDTO, MonthlySalesOutputDTO } from "../dto/dashboard.dto";
import { OrderOutputDTO } from "../dto/order.dto";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { encrypt } from "../helpers/encrypt";
import { BookService, BookServiceInterface } from "./book.service";
import { CategoryService, CategoryServiceInterface } from "./category.service";
import { OrderService, OrderServiceInterface } from "./order.service";
import { CouponService, CouponServiceInterface } from "./coupon.service";
import { BrandService, BrandServiceInterface } from "./brand.service";
import { CustomerService, CustomerServiceInterface } from "./customer.service";
import { ReturnExchangeRequestService, ReturnExchangeRequestServiceInterface } from "./return-exchange-request.service";
import { Repository } from "typeorm";
import { Admin } from "../domain/entity/Admin";
import { Coupon } from "../domain/entity/Coupon";
import { Brand } from "../domain/entity/Brand";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import type { CouponOutputDTO, CreateCouponInputDTO } from "../dto/coupon.dto";
import type { BrandOutputDTO } from "../dto/brand.dto";
import type { CustomerOutputDTO } from "../dto/customer.dto";
import type { ReturnExchangeRequestOutputDTO } from "../dto/return-exchange-request.dto";
import { fromValue } from "../domain/utils/fromValue";
import { CouponStatus } from "../domain/enums/CouponStatus";
import { CustomerMapper } from "../mapper/CustomerMapper";
import { Customer } from "../domain/entity/Customer";

export interface AdminServiceInterface {
    authenticate(email: string, password: string): Promise<AuthOutputDTO>;
    dashboard(startDate?: Date, endDate?: Date): Promise<DashboardDataOutputDTO>;
    createCoupon(input: CreateCouponInputDTO): Promise<CouponOutputDTO>;
    toggleCouponStatus(couponId: number, status: string): Promise<CouponOutputDTO>;
    listCoupons(): Promise<CouponOutputDTO[]>;
    createBrand(name: string): Promise<BrandOutputDTO>;
    deleteBrand(brandId: number): Promise<boolean>;
    listBrands(): Promise<BrandOutputDTO[]>;
    listOrders(): Promise<OrderOutputDTO[]>;
    getOrderDetails(orderId: number): Promise<OrderOutputDTO>;
    listUsers(): Promise<CustomerOutputDTO[]>;
    listReturns(): Promise<ReturnExchangeRequestOutputDTO[]>;
    updateReturnStatus(returnId: number, status: string): Promise<ReturnExchangeRequestOutputDTO>;
}

export class AdminService implements AdminServiceInterface {
    private bookService: BookServiceInterface;
    private orderService: OrderServiceInterface;
    private categoryService: CategoryServiceInterface;
    private couponService: CouponServiceInterface;
    private brandService: BrandServiceInterface;
    private customerRepository: Repository<Customer>;
    private returnService: ReturnExchangeRequestServiceInterface;
    private adminRepository: Repository<Admin>;
    private couponRepository: Repository<Coupon>;
    private brandRepository: Repository<Brand>;
    
    public constructor(repositoryFactory: RepositoryFactory) {
        this.bookService = new BookService(repositoryFactory);
        this.orderService = new OrderService(repositoryFactory);
        this.categoryService = new CategoryService(repositoryFactory);
        this.couponService = new CouponService(repositoryFactory);
        this.brandService = new BrandService(repositoryFactory);
        this.customerRepository = repositoryFactory.getCustomerRepository();
        this.returnService = new ReturnExchangeRequestService(repositoryFactory);
        this.adminRepository = repositoryFactory.getAdminRepository();
        this.couponRepository = repositoryFactory.getCouponRepository();
        this.brandRepository = repositoryFactory.getBrandRepository();
    }
    public async listCoupons(): Promise<CouponOutputDTO[]> {
        return this.couponService.list();
    }
    
    public async authenticate(email: string, password: string): Promise<AuthOutputDTO> {
        const admin = await this.adminRepository.findOne({
            where: { email },
        });

        if(!admin) {
            throw new UnauthorizedException("Email ou senha inválidos");
        }

        const validCredentials = await encrypt.comparepassword(admin.password.value, password);
        if (!validCredentials) {
            throw new UnauthorizedException("Email ou senha inválidos");
        }

        const accessToken = encrypt.generateToken({
            id: admin.id.toString(),
            role: "admin",
        });
        return new AuthOutputDTO(accessToken);
    }
    
    public async dashboard(startDate?: Date, endDate?: Date): Promise<DashboardDataOutputDTO> {
        const summary = await this.summary(startDate, endDate);
        const salesData = await this.salesData(startDate, endDate);
        const recentOrders = await this.recentOrders(startDate, endDate);
        const categoryOverview = await this.categoryOverview(startDate, endDate);

        return new DashboardDataOutputDTO(
            summary,
            salesData,
            recentOrders,
            categoryOverview
        );
    }

    private async summary(startDate?: Date, endDate?: Date): Promise<DashboardSummaryOutputDTO> {
        const lowStockCount = await this.bookService.lowStockCount();
        const itemsCount = await this.bookService.itemsCount();
        const totalSales = await this.orderService.totalSales(startDate, endDate);
        const totalOrders = await this.orderService.totalOrders(startDate, endDate);
        const averageOrderValue = await this.orderService.averageOrderValue(startDate, endDate);

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
    
    private async salesData(startDate?: Date, endDate?: Date): Promise<MonthlySalesOutputDTO[]> {
        return this.orderService.monthlySales(startDate, endDate);
    }
    
    private async recentOrders(startDate?: Date, endDate?: Date): Promise<OrderOutputDTO[]> {
        return this.orderService.getRecentOrders(startDate, endDate);
    }

    private async categoryOverview(startDate?: Date, endDate?: Date): Promise<BookCategoryOverviewOutputDTO[]> {
        return this.categoryService.overview(startDate, endDate);
    }

    public async createCoupon(input: CreateCouponInputDTO): Promise<CouponOutputDTO> {
        return this.couponService.store(input);
    }

    public async toggleCouponStatus(couponId: number, status: string): Promise<CouponOutputDTO> {
        const coupon = await this.couponRepository.findOne({ where: { id: couponId } });

        if (!coupon) {
            throw new Error("Coupon not found");
        }

        coupon.status = fromValue(CouponStatus, status);
        const updated = await this.couponRepository.save(coupon);

        return {
            id: updated.id,
            code: updated.code,
            discount: updated.discount,
            type: updated.type,
            status: updated.status,
            expiryDate: updated.expiryDate
        };
    }

    public async createBrand(name: string): Promise<BrandOutputDTO> {
        const brand = new Brand(name);
        const created = await this.brandRepository.save(brand);

        return { id: created.id, name: created.name };
    }

    public async deleteBrand(brandId: number): Promise<boolean> {
        const result = await this.brandRepository.delete(brandId);
        return result.affected !== 0;
    }

    public async listBrands(): Promise<BrandOutputDTO[]> {
        return this.brandService.index();
    }

    public async listOrders(): Promise<OrderOutputDTO[]> {
        return this.orderService.all();
    }

    public async getOrderDetails(orderId: number): Promise<OrderOutputDTO> {
        return this.orderService.show(orderId);
    }

    public async listUsers(): Promise<CustomerOutputDTO[]> {
        const customers = await this.customerRepository.find();
        return customers.map(c => CustomerMapper.entityToOutputDTO(c));
    }

    public async listReturns(): Promise<ReturnExchangeRequestOutputDTO[]> {
        return this.returnService.findAll();
    }

    public async updateReturnStatus(returnId: number, status: string): Promise<ReturnExchangeRequestOutputDTO> {
        return this.returnService.update(status, returnId);
    }
}
