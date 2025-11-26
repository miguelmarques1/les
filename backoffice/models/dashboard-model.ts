export interface DashboardSummary {
  totalSales: number
  formattedTotalSales: string
  totalOrders: number
  averageOrderValue: number
  formattedAverageOrderValue: string
  inventoryCount: number
  lowStockItems: number
}

export interface SalesDataItem {
  month: string
  monthNumber: number
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  year: number
}

export interface CategoryOverviewItem {
  categoryId: string
  categoryName: string
  percentage: number
  totalItems: number
  colorCode: string
}

export interface OrderItem {
  status: string
  code: string
  supplier: string
  costs_value: string
  book_details: {
    id: number
    author: string
    categories: Array<{
      id: number
      name: string
    }>
    year: number
    title: string
    publisher: string
    precification_group: {
      id: number
      name: string
      profit_percentage: string
    }
    edition: number
    pages: number
    synopsis: string
    height: string
    width: string
    weight: string
    depth: string
    isbn: string
    status: string
  }
  entry_date: string
  id: number
  sale_date: string
  unit_price: number
  order_item_id: number
}

export interface RecentOrderItem {
  id: number
  address: {
    alias: string
    type: string
    residence_type: string
    street_type: string
    street: string
    number: string
    district: string
    zip_code: string
    city: string
    state: string
    country: string
    observations: string | null
  }
  status: string
  items: OrderItem[]
  transaction: {
    id: number
    amount: string
    card: {
      number: string
      holder_name: string
      expiry_date: string
      brand_id: number
    }
    date: string
    coupon?: {
      id: number
      code: string
      discount: string
      type: string
      status: string
      expiryDate: string
    }
  }
}

export interface DashboardData {
  summary: DashboardSummary
  salesData: SalesDataItem[]
  recentOrders: RecentOrderItem[]
  categoryOverview: CategoryOverviewItem[]
}

export class DashboardModel {
  summary: DashboardSummary
  salesData: SalesDataItem[]
  recentOrders: RecentOrderItem[]
  categoryOverview: CategoryOverviewItem[]

  constructor(data: DashboardData) {
    this.summary = data.summary
    this.salesData = data.salesData
    this.recentOrders = data.recentOrders
    this.categoryOverview = data.categoryOverview
  }

  static fromMap(map: any): DashboardModel {
    return new DashboardModel({
      summary: map.summary,
      salesData: map.salesData || [],
      recentOrders: map.recentOrders || [],
      categoryOverview: map.categoryOverview || [],
    })
  }

  toMap(): Record<string, any> {
    return {
      summary: this.summary,
      salesData: this.salesData,
      recentOrders: this.recentOrders,
      categoryOverview: this.categoryOverview,
    }
  }
}
