import { PrecificationGroup } from "../domain/entity/PrecificationGroup";
import { PrecificationGroupOutputDTO } from "../dto/precification-group.dto";

export class PrecificationGroupMapper {
    static entityToOutputDTO(
        precificationGroup: PrecificationGroup
    ): PrecificationGroupOutputDTO {
        return new PrecificationGroupOutputDTO(
            precificationGroup.id,
            precificationGroup.name,
            precificationGroup.profitPercentage
        );
    }
}