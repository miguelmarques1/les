import { Repository } from "typeorm"
import { Card } from "../domain/entity/Card"
import type { CreateCardInputDTO, DeleteCardInputDTO, CardOutputDTO } from "../dto/card.dto"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { CardMapper } from "../mapper/CardMapper"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { NotFoundException } from "../exceptions/NotFoundException"
import { Customer } from "../domain/entity/Customer"
import { Brand } from "../domain/entity/Brand"

export interface CardServiceInterface {
  store(input: CreateCardInputDTO): Promise<CardOutputDTO>
  index(customerId: number): Promise<CardOutputDTO[]>
  delete(input: DeleteCardInputDTO): Promise<boolean>
  find(cardId: number, customerId: number): Promise<CardOutputDTO>
}

export class CardService implements CardServiceInterface {
  private cardRepository: Repository<Card>
  private customerRepository: Repository<Customer>
  private brandRepository: Repository<Brand>

  public constructor(repositoryFactory: RepositoryFactory) {
    this.cardRepository = repositoryFactory.getCardRepository()
    this.customerRepository = repositoryFactory.getCustomerRepository()
    this.brandRepository = repositoryFactory.getBrandRepository()
  }

  public async find(cardId: number, customerId: number): Promise<CardOutputDTO> {
    const card = await this.cardRepository.findOne({
      where: {
        id: cardId,
        customer: {
          id: customerId,
        },
      },
      relations: {
        brand: true,
        customer: true,
      },
    })
    if (!card) {
      throw new NotFoundException("Cartão não encontrado")
    }
    const output = CardMapper.entityToOutputDTO(card)

    return output
  }

  public async index(customerId: number): Promise<CardOutputDTO[]> {
    const cards = await this.cardRepository.find({
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: {
        brand: true,
        customer: true,
      }
    })

    const output: CardOutputDTO[] = []
    cards.forEach((card) => {
      const dto = CardMapper.entityToOutputDTO(card)
      output.push(dto)
    })

    return output
  }

  public async delete(input: DeleteCardInputDTO): Promise<boolean> {
    const card = await this.cardRepository.findOne({
      where: {
        id: input.cardId,
        customer: {
          id: input.customerId,
        }
      },
      relations: {
        brand: true,
      },
    })
    if(!card) {
      throw new NotFoundException("Cartão não encontrado")
    }

    const result = await this.cardRepository.delete(card.id)

    return result.affected !== 0
  }

  public async store(input: CreateCardInputDTO): Promise<CardOutputDTO> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: input.customer_id,
      }
    })
    if (!customer) {
      throw new UnauthorizedException("Cliente não encontrado")
    }

    const brand = await this.brandRepository.findOne({
      where: {
        id: input.brand_id,
      }
    })
    if (!brand) {
      throw new NotFoundException("Bandeira não encontrada")
    }

    const entity = new Card(
      input.number,
      input.holder_name,
      input.cvv,
      customer,
      input.expiry_date,
      brand,
    )

    const card = await this.cardRepository.save(entity)

    return CardMapper.entityToOutputDTO(card)
  }
}
