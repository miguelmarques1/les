import { Phone } from "../domain/entity/Phone";
import { PhoneOutputDTO } from "../dto/phone.dto";

export class PhoneMapper {
    static entityToOutputDTO(phone: Phone): PhoneOutputDTO {
        return new PhoneOutputDTO(
            phone.id,
            phone.type,
            phone.ddd,
            phone.number,
        )
    }
}