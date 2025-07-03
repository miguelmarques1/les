// import { getRepository, QueryRunner, Repository } from "typeorm";
// import { CreateCustomerInputDTO, CustomerOutputDTO } from "../dto/customer.dto";
// import { CreateUserInputDTO, UserOutputDTO } from "../dto/user.dto";
// import { User } from "../domain/entity/User";
// import { AppDataSource } from "../data-source";
// import { encrypt } from "../helpers/encrypt";

// export interface UserServiceInterface {
//     store(input: CreateUserInputDTO, queryRunner?: QueryRunner): Promise<UserOutputDTO>;
// }

// export class UserService implements UserServiceInterface {
//     private userRepository: Repository<User>;

//     constructor () {
//         this.userRepository = AppDataSource.getRepository(User);
//     }

//     public async store(input: CreateUserInputDTO, queryRunner?: QueryRunner): Promise<UserOutputDTO> {
//         const encryptedPass = await encrypt.encryptpass(input.password);
//         const user = new User();
//         user.name = input.name;
//         user.email = input.email;
//         user.password = encryptedPass;
//         user.role = input.role;
//         const savedUser = queryRunner != null ? await queryRunner.manager.save(user) : await this.userRepository.save(user);

//         return savedUser.toOutputDTO();
//     }
// }