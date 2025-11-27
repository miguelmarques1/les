export interface DashboardSummary {
  totalSales: number
  formattedTotalSales: string
  totalOrders: number
  averageOrderValue: number
  formattedAverageOrderValue: string
  inventoryCount: number
  lowStockItems: number
}

export interface SalesData {
  month: string
  monthNumber: number
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  year: number
}

export interface RecentOrder {
  id: number
  address: {
    id: number
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
    customerId: number
    observations: string
  }
  status: string
  items: Array<{
    status: string
    code: string
    supplier: string
    costs_value: number
    book_details: any
    entry_date: string
    id: number
    sale_date: string
    unit_price: number
    order_item_id: number
  }>
  transaction: {
    id: number
    amount: number
    card: {
      id: number
      number: string
      holder_name: string
      expiry_date: string
      brand_id: number
      customer_id: number
    }
    date: string
    coupon: {
      id: number
      code: string
      discount: number
      type: string
      status: string
      expiryDate: string
    }
  }
}

export interface CategoryOverview {
  categoryId: number
  categoryName: string
  percentage: number
  totalItems: number
  colorCode: string
}

export interface DashboardData {
  summary: DashboardSummary
  salesData: SalesData[]
  recentOrders: RecentOrder[]
  categoryOverview: CategoryOverview[]
}

export interface DashboardResponse {
  data: DashboardData
  error: boolean
  message: string | null
}
