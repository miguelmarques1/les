import { Customer } from "../domain/entity/Customer";
import { CustomerOutputDTO } from "../dto/customer.dto";

export class CustomerMapper {
    static entityToOutputDTO(customer: Customer): CustomerOutputDTO {
        return new CustomerOutputDTO(
            customer.id,
            customer.name,
            customer.email,
            customer.gender,
            customer.birthdate,
            customer.document.value,
            customer.ranking,
            customer.code,
            customer.status
        );
    }
}