import { Address } from "../domain/entity/Address";
import { AddressOutputDTO } from "../dto/address.dto";

export class AddressMapper {
    static entityToOutputDTO(address: Address): AddressOutputDTO {
        return new AddressOutputDTO(
            address.id,
            address.alias,
            address.type,
            address.residenceType,
            address.streetType,
            address.street,
            address.number,
            address.district,
            address.zipcode,
            address.city,
            address.state,
            address.country,
            address.customer.id as number,
            address.observations,
        );
    }
}