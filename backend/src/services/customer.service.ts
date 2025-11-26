import type { CreateCustomerInputDTO, CustomerOutputDTO, DeleteCustomerInputDTO, UpdateCustomerInputDTO } from "../dto/customer.dto"
import { AddressService, type AddressServiceInterface } from "./address.service"
import { Customer } from "../domain/entity/Customer"
import { PhoneService, type PhoneServiceInterface } from "./phone.service"
import { AlreadyExistsException } from "../exceptions/AlreadyExistsException"
import { NotFoundException } from "../exceptions/NotFoundException"
import { CustomerMapper } from "../mapper/CustomerMapper"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { Repository } from "typeorm"
import { DBTransaction } from "../repositories/DBTransaction"
import { fromValue } from "../domain/utils/fromValue"
import { Gender } from "../domain/enums/Gender"
import { encrypt } from "../helpers/encrypt"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { UserStatus } from "../domain/enums/UserStatus"

export interface CustomerServiceInterface {
  store(input: CreateCustomerInputDTO): Promise<CustomerOutputDTO>
  show(id: number): Promise<CustomerOutputDTO>
  update(id: number, input: UpdateCustomerInputDTO): Promise<CustomerOutputDTO>
  delete(input: DeleteCustomerInputDTO): Promise<boolean>
}

export class CustomerService implements CustomerServiceInterface {
  private customerRepository: Repository<Customer>;
  private addressService: AddressServiceInterface;
  private phoneService: PhoneServiceInterface;
  private transaction: DBTransaction;

  constructor(repositoryFactory: RepositoryFactory) {
    this.customerRepository = repositoryFactory.getCustomerRepository()
    this.transaction = repositoryFactory.createTransaction()
    this.phoneService = new PhoneService(repositoryFactory)
    this.addressService = new AddressService(repositoryFactory)
  }

  public async delete(input: DeleteCustomerInputDTO): Promise<boolean> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: input.customerId,
      }
    });
    if(!customer) {
      throw new NotFoundException("Usuário não existe");
    }

    const ableToDelete = customer.password.compare(input.password);
    if(!ableToDelete) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    customer.status = UserStatus.INACTIVE;
    const result = await this.customerRepository.save(customer);

    return result.status == UserStatus.INACTIVE;
  }

  public async update(id: number, input: UpdateCustomerInputDTO): Promise<CustomerOutputDTO> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException("Usuário não encontrado");
    }

    customer.name = input.name ?? customer.name;
    customer.birthdate = input.birthdate ? new Date(input.birthdate) : customer.birthdate;
    customer.gender = input.gender ? fromValue(Gender, input.gender) : customer.gender;

    await this.customerRepository.save(customer);

    return this.show(id);
  }

  public async show(id: number): Promise<CustomerOutputDTO> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: id,
      }
    })
    if (!customer) {
      throw new NotFoundException("Usuário não encontrado")
    }

    return CustomerMapper.entityToOutputDTO(customer)
  }

  public async store(input: CreateCustomerInputDTO): Promise<CustomerOutputDTO> {
    await this.transaction.start()
    try {
      const entity = new Customer(
        input.email,
        input.name,
        input.birthdate,
        input.gender,
        input.document,
        input.password,
        null,
        null,
        null,
      )
      let customerAlreadyExists = await this.customerRepository.findOne({
        where: {
          email: input.email,
        }
      })
      if (customerAlreadyExists) {
        throw new AlreadyExistsException("Email já cadastrado no nosso sistema");
      }
      const customer = await this.customerRepository.save(entity)

      const bilAddrInput = input.billing_address
      bilAddrInput.customerId = customer.id
      await this.addressService.store(bilAddrInput)

      const delAddrInput = input.delivery_address
      delAddrInput.customerId = customer.id
      await this.addressService.store(delAddrInput)

      const phoneInput = input.phone
      phoneInput.customerId = customer.id
      await this.phoneService.store(phoneInput)

      await this.transaction.commit()
      return this.show(customer.id)
    } catch (e) {
      await this.transaction.rollback()
      throw e
    }
  }
}
