import { OrderOutputDTO } from "./order.dto";

export class MonthlySalesOutputDTO {
  constructor(
    public readonly month: string,
    public readonly monthNumber: number, 
    public readonly totalSales: number,
    public readonly totalOrders: number,
    public readonly averageOrderValue: number,
    public readonly year: number
  ) {}
}

export class BookCategoryOverviewOutputDTO {
  constructor(
    public readonly categoryId: string,
    public readonly categoryName: string,
    public readonly percentage: number,
    public readonly totalItems: number,
    public readonly colorCode: string
  ) {}
}

export class DashboardSummaryOutputDTO {
  constructor(
    public readonly totalSales: number,
    public readonly formattedTotalSales: string,
    public readonly totalOrders: number,
    public readonly averageOrderValue: number,
    public readonly formattedAverageOrderValue: string,
    public readonly inventoryCount: number,
    public readonly lowStockItems: number,
  ) {}
}

export class DashboardDataOutputDTO {
  constructor(
    public readonly summary: DashboardSummaryOutputDTO,
    public readonly salesData: MonthlySalesOutputDTO[],
    public readonly recentOrders: OrderOutputDTO[],
    public readonly categoryOverview: BookCategoryOverviewOutputDTO[],
  ) {}
}