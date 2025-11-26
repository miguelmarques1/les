import { Repository } from "typeorm";
import { Order } from "../domain/entity/Order";
import { MonthlySalesOutputDTO } from "../dto/dashboard.dto";

export const OrderRepository = {
  async monthlySales(this: Repository<Order>, startDate?: Date, endDate?: Date): Promise<MonthlySalesOutputDTO[]> {
    let queryBuilder = this.createQueryBuilder("order")
      .select(`TO_CHAR(order.createdAt, 'YYYY')`, "year")
      .addSelect(`TO_CHAR(order.createdAt, 'TMMonth')`, "month")
      .addSelect(`CAST(TO_CHAR(order.createdAt, 'MM') AS INTEGER)`, "monthNumber")
      .addSelect("SUM(transaction.amount)", "totalSales")
      .addSelect("COUNT(order.id)", "totalOrders")
      .addSelect("AVG(transaction.amount)", "averageOrderValue")
      .innerJoin("order.transaction", "transaction")
      .groupBy(`TO_CHAR(order.createdAt, 'YYYY')`)
      .addGroupBy(`TO_CHAR(order.createdAt, 'TMMonth')`)
      .addGroupBy(`CAST(TO_CHAR(order.createdAt, 'MM') AS INTEGER)`)
      .orderBy(`TO_CHAR(order.createdAt, 'YYYY')`, "ASC")
      .addOrderBy(`CAST(TO_CHAR(order.createdAt, 'MM') AS INTEGER)`, "ASC");

    if (startDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt <= :endDate", { endDate });
    }

    const raw = await queryBuilder.getRawMany();

    return raw.map(row =>
      new MonthlySalesOutputDTO(
        row.month,
        parseInt(row.monthNumber),
        parseFloat(row.totalSales),
        parseInt(row.totalOrders),
        parseFloat(row.averageOrderValue),
        parseInt(row.year),
      )
    );
  },

  async totalSales(this: Repository<Order>, startDate?: Date, endDate?: Date): Promise<number> {
    let queryBuilder = this.createQueryBuilder("order")
      .select("SUM(transaction.amount)", "total")
      .innerJoin("order.transaction", "transaction");

    if (startDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt <= :endDate", { endDate });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.total) || 0;
  },

  async totalOrders(this: Repository<Order>, startDate?: Date, endDate?: Date): Promise<number> {
    let queryBuilder = this.createQueryBuilder("order");

    if (startDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt <= :endDate", { endDate });
    }

    return queryBuilder.getCount();
  },

  async averageOrderValue(this: Repository<Order>, startDate?: Date, endDate?: Date): Promise<number> {
    let queryBuilder = this.createQueryBuilder("order")
      .select("AVG(transaction.amount)", "average")
      .innerJoin("order.transaction", "transaction");

    if (startDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder = queryBuilder.andWhere("order.createdAt <= :endDate", { endDate });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.average) || 0;
  }
};
