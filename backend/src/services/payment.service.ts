import { Repository } from "typeorm";
import { Order } from "../domain/entity/Order";
import { StockBook } from "../domain/entity/StockBook";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { OrderStatus } from "../domain/enums/OrderStatus";
import { StockBookStatus } from "../domain/enums/StockBookStatus";

export interface PaymentServiceInterface {
    handle(orderId: number): Promise<void>;
}

export class PaymentService implements PaymentServiceInterface {
    private orderRepository: Repository<Order>
    private stockBookRepository: Repository<StockBook>

    constructor(repositoryFactory: RepositoryFactory) {
        this.orderRepository = repositoryFactory.getOrderRepository();
        this.stockBookRepository = repositoryFactory.getStockBookRepository();
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handle(orderId: number): Promise<void> {
        await this.sleep(120000);
        const approved = Math.random() < 0.8;
        const order = await this.orderRepository.findOne({
            where: {
                id: orderId,
            },
            relations: {
                items: true,
            }
        });
        if (!approved) {
            this.denied(order);
        }

        order.setStatus(OrderStatus.APPROVED);
        await this.orderRepository.save(order);
    }

    private async denied(order: Order) {
        order.setStatus(OrderStatus.REJECTED);
        for (let item of order.items) {
            item.status = StockBookStatus.AVAILABLE;
            await this.stockBookRepository.save(item);
        }

        await this.orderRepository.save(order);
    }
}
