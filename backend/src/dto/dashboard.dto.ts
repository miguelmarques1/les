import { OrderOutputDTO } from "./order.dto";

export type DashboardPeriodInputDTO = {
    startDate?: string;
    endDate?: string; 
};

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
    public readonly period?: { startDate?: Date; endDate?: Date; label: string }
  ) {}
}

export class DashboardPeriodOutputDTO {
    constructor(
        public readonly startDate: Date | null,
        public readonly endDate: Date | null,
        public readonly label: string
    ) {}

    static create(startDate?: string, endDate?: string): DashboardPeriodOutputDTO {
        let start: Date | null = null;
        let end: Date | null = null;
        let label = "Todo o período";

        if (startDate) {
            start = new Date(startDate);
            if (isNaN(start.getTime())) {
                throw new Error("startDate inválida. Use formato YYYY-MM-DD");
            }
        }

        if (endDate) {
            end = new Date(endDate);
            if (isNaN(end.getTime())) {
                throw new Error("endDate inválida. Use formato YYYY-MM-DD");
            }
        }

        if (start && end) {
            label = `${start.toLocaleDateString('pt-BR')} até ${end.toLocaleDateString('pt-BR')}`;
        } else if (start) {
            label = `A partir de ${start.toLocaleDateString('pt-BR')}`;
        } else if (end) {
            label = `Até ${end.toLocaleDateString('pt-BR')}`;
        }

        return new DashboardPeriodOutputDTO(start, end, label);
    }
}