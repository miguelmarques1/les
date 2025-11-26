export class AdminAuthOutputDTO {
  constructor(
    public readonly token: string,
    public readonly admin: {
      id: number;
      email: string;
      name: string;
      role: string;
    }
  ) {}
}

export class CouponToggleStatusDTO {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly discount: number,
    public readonly type: string,
    public readonly status: string,
    public readonly expiryDate: Date
  ) {}
}

export class BrandManagementDTO {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

export class AdminDashboardOutputDTO {
  constructor(
    public readonly totalSales: number,
    public readonly totalOrders: number,
    public readonly averageOrderValue: number,
    public readonly recentOrders: any[],
    public readonly monthlySales: any[],
    public readonly period: {
      startDate?: Date;
      endDate?: Date;
    }
  ) {}
}

export type UpdateReturnStatusInputDTO = {
  status: string;
};

export type CreateBrandInputDTO = {
  name: string;
};
