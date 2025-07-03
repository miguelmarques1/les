import { Brand } from "../domain/entity/Brand";
import { BrandOutputDTO } from "../dto/brand.dto";

export class BrandMapper {
    static entityToOutputDTO(brand: Brand): BrandOutputDTO {
        return new BrandOutputDTO(
            brand.id,
            brand.name,
        );
    }
}