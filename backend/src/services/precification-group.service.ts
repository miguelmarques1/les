import { Repository } from "typeorm";
import { PrecificationGroupOutputDTO } from "../dto/precification-group.dto";
import { PrecificationGroupMapper } from "../mapper/PrecificationGroupMapper";
import { PrecificationGroup } from "../domain/entity/PrecificationGroup";
import { RepositoryFactory } from "../factories/RepositoryFactory";

export interface PrecificationGroupServiceInterface {
  index(pgpId: number): Promise<PrecificationGroupOutputDTO>;
  getAll(): Promise<PrecificationGroupOutputDTO[]>;
}

export class PrecificationGroupService implements PrecificationGroupServiceInterface {
  private precificationGroupRepository: Repository<PrecificationGroup>;

  constructor(repositoryFactory: RepositoryFactory) {
    this.precificationGroupRepository =
      repositoryFactory.getPrecificationGroupRepository();
  }

  public async index(pgpId: number): Promise<PrecificationGroupOutputDTO> {
    const precificationGroup = await this.precificationGroupRepository.findOne({
      where: {
        id: pgpId,
      }
    });

    return PrecificationGroupMapper.entityToOutputDTO(precificationGroup);
  }

  public async getAll(): Promise<PrecificationGroupOutputDTO[]> {
    const precificationGroups = await this.precificationGroupRepository.find()

    return precificationGroups.map((pg) => PrecificationGroupMapper.entityToOutputDTO(pg))
  }
}
