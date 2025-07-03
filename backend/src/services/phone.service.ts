import { Repository } from "typeorm"
import { Phone } from "../domain/entity/Phone"
import type { CreatePhoneInputDTO, DeletePhoneInputDTO, PhoneOutputDTO, UpdatePhoneInputDTO } from "../dto/phone.dto"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { PhoneMapper } from "../mapper/PhoneMapper"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { NotFoundException } from "../exceptions/NotFoundException"
import { Customer } from "../domain/entity/Customer"

export interface PhoneServiceInterface {
  store(input: CreatePhoneInputDTO): Promise<PhoneOutputDTO>
  index(customerId: number): Promise<PhoneOutputDTO[]>
  update(input: UpdatePhoneInputDTO): Promise<PhoneOutputDTO>
  delete(input: DeletePhoneInputDTO): Promise<boolean>
}

export class PhoneService implements PhoneServiceInterface {
  private phoneRepository: Repository<Phone>;
  private customerRepository: Repository<Customer>;

  public constructor(repositoryFactory: RepositoryFactory) {
    this.phoneRepository = repositoryFactory.getPhoneRepository();
    this.customerRepository = repositoryFactory.getCustomerRepository();
  }

  public async index(customerId: number): Promise<PhoneOutputDTO[]> {
    const phones = await this.phoneRepository.find({
      where: {
        customer: {
          id: customerId,
        }
      }
    })

    const output: PhoneOutputDTO[] = []
    phones.forEach((phone) => {
      const dto = PhoneMapper.entityToOutputDTO(phone)
      output.push(dto)
    })

    return output
  }

  public async update(input: UpdatePhoneInputDTO): Promise<PhoneOutputDTO> {
    const existingPhone = await this.phoneRepository.findOne({
      where: {
        id: input.phoneId,
      },
      relations: {
        customer: true,
      }
    })
    if (!existingPhone) {
      throw new Error("Telefone não encontrado")
    }

    if (existingPhone.customer.id !== input.customerId) {
      throw new UnauthorizedException("Você não tem permissões para atualizar este telefone")
    }

    const updatedPhone = new Phone(input.type, input.ddd, input.number, existingPhone.customer)

    await this.phoneRepository.update(input.phoneId, updatedPhone)

    return PhoneMapper.entityToOutputDTO(updatedPhone)
  }

  public async delete(input: DeletePhoneInputDTO): Promise<boolean> {
    const phone = await this.phoneRepository.findOne({
      where: {
        id: input.phoneId,
        customer: {
          id: input.customerId,
        }
      }
    });
    if (!phone) {
      throw new NotFoundException("Telefone não encontrado")
    }

    const result = await this.phoneRepository.delete(phone.id)
    return result.affected !== 0
  }

  public async store(input: CreatePhoneInputDTO): Promise<PhoneOutputDTO> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: input.customerId,
      }
    })
    const entity = new Phone(input.type, input.ddd, input.number, customer)

    const phone = await this.phoneRepository.save(entity)

    return PhoneMapper.entityToOutputDTO(phone)
  }
}
