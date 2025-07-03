import type {
  AddressOutputDTO,
  CreateAddressInputDTO,
  DeleteAddressInputDTO,
  UpdateAddressInputDTO,
} from "../dto/address.dto"
import { Address } from "../domain/entity/Address"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { AddressMapper } from "../mapper/AddressMapper"
import { Repository } from "typeorm"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import { NotFoundException } from "../exceptions/NotFoundException"
import { Customer } from "../domain/entity/Customer"
import { fromValue } from "../domain/utils/fromValue"
import { ResidenceType } from "../domain/enums/ResidenceType"
import { AddressType } from "../domain/enums/AddressType"

export interface AddressServiceInterface {
  store(input: CreateAddressInputDTO): Promise<AddressOutputDTO>
  index(customerId: number): Promise<AddressOutputDTO[]>
  update(input: UpdateAddressInputDTO): Promise<AddressOutputDTO>
  delete(input: DeleteAddressInputDTO): Promise<boolean>
  find(addressId: number, customerId: number): Promise<AddressOutputDTO>
}

export class AddressService implements AddressServiceInterface {
  private customerRepository: Repository<Customer>
  private addressRepository: Repository<Address>

  public constructor(repositoryFactory: RepositoryFactory) {
    this.addressRepository = repositoryFactory.getAddressRepository()
    this.customerRepository = repositoryFactory.getCustomerRepository()
  }

  public async update(input: UpdateAddressInputDTO): Promise<AddressOutputDTO> {
    const oldAddress = await this.addressRepository.findOne({
      where: { id: input.addressId },
      relations: { customer: true }
    });

    if (!oldAddress) {
      throw new NotFoundException("Endereço não encontrado");
    }

    if (oldAddress.customer.id !== input.customerId) {
      throw new UnauthorizedException("Você não tem permissões para atualizar este endereço");
    }

    oldAddress.alias = input.alias ?? oldAddress.alias;
    oldAddress.type = fromValue(AddressType, input.type) ?? oldAddress.type;
    oldAddress.residenceType = fromValue(ResidenceType, input.residence_type) ?? oldAddress.residenceType;
    oldAddress.streetType = input.street_type ?? oldAddress.streetType;
    oldAddress.street = input.street ?? oldAddress.street;
    oldAddress.number = input.number ?? oldAddress.number;
    oldAddress.district = input.district ?? oldAddress.district;
    oldAddress.zipcode = input.zip_code ?? oldAddress.zipcode;
    oldAddress.city = input.city ?? oldAddress.city;
    oldAddress.state = input.state ?? oldAddress.state;
    oldAddress.country = input.country ?? oldAddress.country;
    oldAddress.observations = input.observations ?? oldAddress.observations;

    await this.addressRepository.save(oldAddress); // Atualiza direto

    return this.find(oldAddress.id, oldAddress.customer.id);
  }


  public async delete(input: DeleteAddressInputDTO): Promise<boolean> {
    const address = await this.addressRepository.findOne({ where: { id: input.addressId }, relations: { customer: true }, })
    if (address.customer.id !== input.customerId) {
      throw new UnauthorizedException("Você não tem permissões para excluir este endereço")
    }

    const result = await this.addressRepository.delete(input.addressId)

    return result.affected !== 0
  }

  public async index(customerId: number): Promise<AddressOutputDTO[]> {
    const addresses = await this.addressRepository.find({
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: {
        customer: true,
      }
    })

    const output: AddressOutputDTO[] = []
    addresses.forEach((address) => {
      const dto = AddressMapper.entityToOutputDTO(address)
      output.push(dto)
    })

    return output
  }

  public async find(addressId: number, customerId: number): Promise<AddressOutputDTO> {
    const address = await this.addressRepository.findOne({
      where: {
        id: addressId,
        customer: {
          id: customerId,
        },
      },
      relations: {
        customer: true,
      }
    })
    if (!address) {
      throw new NotFoundException("Endereço não encontrado")
    }

    const output = AddressMapper.entityToOutputDTO(address)

    return output
  }

  public async store(input: CreateAddressInputDTO): Promise<AddressOutputDTO> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: input.customerId,
      }
    })
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado")
    }

    const entity = new Address(
      input.alias,
      input.type,
      input.residence_type,
      input.street_type,
      input.street,
      input.number,
      input.district,
      input.zip_code,
      input.city,
      input.state,
      input.country,
      customer,
      input.observations,
    )

    const address = await this.addressRepository.save(entity)

    return AddressMapper.entityToOutputDTO(address)
  }
}
