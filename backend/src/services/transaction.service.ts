import { Repository } from "typeorm";
import { PrecificationGroupOutputDTO } from "../dto/precification-group.dto";
import { PrecificationGroupMapper } from "../mapper/PrecificationGroupMapper";
import { PrecificationGroup } from "../domain/entity/PrecificationGroup";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { Transaction } from "../domain/entity/Transaction";
import { fromValue } from "../domain/utils/fromValue";
import { PaymentStatus } from "../domain/enums/PaymentStatus";
import { UpdateTransactionInputDTO } from "../dto/transaction.dto";
import { Order } from "../domain/entity/Order";

export interface TransactionServiceInterface {
    update(input: UpdateTransactionInputDTO): Promise<void>;
}

export class TransactionService implements TransactionServiceInterface {
    private transactionRepository: Repository<Transaction>;
    private orderRepository: Repository<Order>

    constructor(repositoryFactory: RepositoryFactory) {
        this.transactionRepository = repositoryFactory.getTransactionRepository();
        this.orderRepository = repositoryFactory.getOrderRepository();
    }

    async update(input: UpdateTransactionInputDTO): Promise<void> {
        const paymentStatus = fromValue(PaymentStatus, input.status);
        const transaction = await this.transactionRepository.findOne({
            where: {
                id: input.transaction_id,
            },
            relations: {
                order: true,
            },
        });

        const order = transaction.order;
        const orderStatus = paymentStatus == PaymentStatus.APPROVED ? "APPROVED" : "REJECTED";
        order.setStatus(orderStatus);

        await this.orderRepository.save(order);
    }
}
