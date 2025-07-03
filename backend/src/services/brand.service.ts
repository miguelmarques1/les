import { Repository } from "typeorm";
import { BrandOutputDTO } from "../dto/brand.dto";
import { BrandMapper } from "../mapper/BrandMapper";
import { Brand } from "../domain/entity/Brand";
import { RepositoryFactory } from "../factories/RepositoryFactory";

export interface BrandServiceInterface {
    index(): Promise<BrandOutputDTO[]>;
}

export class BrandService implements BrandServiceInterface {
    private brandRepository: Repository<Brand>;

    public constructor(
        repositoryFactory: RepositoryFactory,
    ) {
        this.brandRepository = repositoryFactory.getBrandRepository();
    }

    public async index(): Promise<BrandOutputDTO[]> {
        const brands = await this.brandRepository.find();
    
        const output: BrandOutputDTO[] = [];
        brands.forEach((brand) => {
            const dto = BrandMapper.entityToOutputDTO(brand);
            output.push(dto);
        });

        return output;
    }
}
