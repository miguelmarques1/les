import { Repository } from "typeorm"
import { type AuthInputDTO, AuthOutputDTO } from "../dto/auth.dto"
import { UnauthorizedException } from "../exceptions/UnauthorizedException"
import { encrypt } from "../helpers/encrypt"
import { Customer } from "../domain/entity/Customer"
import { RepositoryFactory } from "../factories/RepositoryFactory"

export interface AuthServiceInterface {
  login(input: AuthInputDTO): Promise<AuthOutputDTO>
}

export class AuthService implements AuthServiceInterface {
  private customerRepository: Repository<Customer>

  public constructor(repositoryFactory: RepositoryFactory) {
    this.customerRepository = repositoryFactory.getCustomerRepository()
  }

  public async login(input: AuthInputDTO): Promise<AuthOutputDTO> {
    const customer = await this.customerRepository.findOne({
      where: {
        email: input.email,
      },
      relations: {
        password: true,
      },
    })
    if (!customer) {
      throw new UnauthorizedException("Usuário não existe")
    }

    const validCredentials = await encrypt.comparepassword(customer.password.value, input.password)
    if (!validCredentials) {
      throw new UnauthorizedException("Email ou senha inválidos")
    }

    const accessToken = encrypt.generateToken({
      id: customer.id.toString(),
      role: "customer",
    })

    return new AuthOutputDTO(accessToken)
  }
}
