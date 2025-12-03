import type { Repository } from "typeorm"
import type { RepositoryFactory } from "../factories/RepositoryFactory"
import type { Transaction } from "../domain/entity/Transaction"
import { fromValue } from "../domain/utils/fromValue"
import { PaymentStatus } from "../domain/enums/PaymentStatus"
import type { UpdateTransactionInputDTO } from "../dto/transaction.dto"
import type { Order } from "../domain/entity/Order"

export interface TransactionServiceInterface {
  update(input: UpdateTransactionInputDTO): Promise<void>
}

export class TransactionService implements TransactionServiceInterface {
  private transactionRepository: Repository<Transaction>
  private orderRepository: Repository<Order>

  constructor(repositoryFactory: RepositoryFactory) {
    this.transactionRepository = repositoryFactory.getTransactionRepository()
    this.orderRepository = repositoryFactory.getOrderRepository()
  }

  async update(input: UpdateTransactionInputDTO): Promise<void> {
    const paymentStatus = fromValue(PaymentStatus, input.status)

    const transaction = await this.transactionRepository.findOne({
      where: {
        id: input.transaction_id,
      },
      relations: {
        order: true,
      },
    })

    const order = transaction.order

    let orderStatus: string
    if (paymentStatus === PaymentStatus.DENIED) {
      orderStatus = "REJECTED"
    } else if (paymentStatus === PaymentStatus.APPROVED) {
      orderStatus = "APPROVED"
    } else {
      orderStatus = "PROCESSING"
    }

    order.setStatus(orderStatus)
    await this.orderRepository.save(order)
  }
}
