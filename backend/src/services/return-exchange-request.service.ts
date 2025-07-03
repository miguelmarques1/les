import { Repository } from "typeorm"
import { ReturnExchangeRequest } from "../domain/entity/ReturnExchangeRequest"
import { ReturnExchangeRequestStatus } from "../domain/enums/ReturnExchangeRequestStatus"
import { StockBookStatus } from "../domain/enums/StockBookStatus"
import { fromValue } from "../domain/utils/fromValue"
import type {
  CreateReturnExchangeRequestInputDTO,
  ReturnExchangeRequestOutputDTO,
} from "../dto/return-exchange-request.dto"
import { ReturnExchangeRequestMapper } from "../mapper/ReturnExchangeRequestMapper"
import { StockBook } from "../domain/entity/StockBook"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { Customer } from "../domain/entity/Customer"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { NotFoundException } from "../exceptions/NotFoundException"

export interface ReturnExchangeRequestServiceInterface {
  update(status: string, returnExchangeRequestId: number): Promise<ReturnExchangeRequestOutputDTO>
  store(input: CreateReturnExchangeRequestInputDTO): Promise<ReturnExchangeRequestOutputDTO>
  findAll(): Promise<ReturnExchangeRequestOutputDTO[]>
  findMine(customerId: number): Promise<ReturnExchangeRequestOutputDTO[]>
}

export class ReturnExchangeRequestService implements ReturnExchangeRequestServiceInterface {
  private returnExchangeRequestRepository: Repository<ReturnExchangeRequest>;
  private stockBookRepository: Repository<StockBook>;
  private customerRepository: Repository<Customer>;

  constructor(repositoryFactory: RepositoryFactory) {
    this.returnExchangeRequestRepository = repositoryFactory.getReturnExchangeRequestRepository();
    this.stockBookRepository = repositoryFactory.getStockBookRepository();
    this.customerRepository = repositoryFactory.getCustomerRepository();
  }

  public async update(status: string, returnExchangeRequestId: number): Promise<ReturnExchangeRequestOutputDTO> {
    const request = await this.returnExchangeRequestRepository.findOne({
      where: {
        id: returnExchangeRequestId,
      },
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          }
        },
        customer: true,
      }
    })
    if(!request) {
      throw new NotFoundException("Pedido não encontrado");
    }

    const newStatus = fromValue(ReturnExchangeRequestStatus, status)
    request.setStatus(newStatus)
    await this.returnExchangeRequestRepository.save(request)
    const requestCompleted = [
      ReturnExchangeRequestStatus.RETURN_COMPLETED,
      ReturnExchangeRequestStatus.EXCHANGE_COMPLETED,
    ].includes(newStatus)
    if (requestCompleted) {
      await this.returnItems(request.items)
    }

    return ReturnExchangeRequestMapper.entityToOutputDTO(request);
  }

  public async store(input: CreateReturnExchangeRequestInputDTO): Promise<ReturnExchangeRequestOutputDTO> {
    const stockBooks = await this.stockBookRepository.findByIds(input.order_item_ids);
    const customer = await this.customerRepository.findOne({
      where: {
        id: input.customer_id,
      }
    });
    if (!customer) {
      throw new UnauthorizedException("Nenhum cliente vinculado a essa conta");
    }

    const entity = new ReturnExchangeRequest(
      input.type,
      input.type == "return"
        ? 'return_requested'
        : 'exchange_requested',
      stockBooks,
      input.description,
      customer,
    );

    const returnExchangeRequest = await this.returnExchangeRequestRepository.save(entity)

    return ReturnExchangeRequestMapper.entityToOutputDTO(returnExchangeRequest)
  }

  public async findAll(): Promise<ReturnExchangeRequestOutputDTO[]> {
    const requests = await this.returnExchangeRequestRepository.find({
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        customer: true,
      }
    })

    return requests.map(ReturnExchangeRequestMapper.entityToOutputDTO)
  }

  public async findMine(customerId: number): Promise<ReturnExchangeRequestOutputDTO[]> {
    const requests = await this.returnExchangeRequestRepository.find({
      where: {
        customer: {
          id: customerId,
        }
      },
      relations: {
        items: {
          book: {
            categories: true,
            precificationGroup: true,
          },
        },
        customer: true,
      }
    });

    return requests.map(ReturnExchangeRequestMapper.entityToOutputDTO);
  }

  private async returnItems(items: StockBook[]) {
    for (let stockBook of items) {
      stockBook.status = StockBookStatus.AVAILABLE;
      await this.stockBookRepository.save(stockBook);
    }
  }
}
