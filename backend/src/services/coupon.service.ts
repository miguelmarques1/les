import { Repository } from "typeorm";
import { Coupon } from "../domain/entity/Coupon";
import { CreateCouponInputDTO } from "../dto/coupon.dto";
import { CouponOutputDTO } from "../dto/coupon.dto";
import { CouponMapper } from "../mapper/CouponMapper";
import { RepositoryFactory } from "../factories/RepositoryFactory";

export interface CouponServiceInterface {
  validate(code?: string, id?: number): Promise<CouponOutputDTO>;
  store(input: CreateCouponInputDTO): Promise<CouponOutputDTO>;
}

export class CouponService implements CouponServiceInterface {
  private couponRepository: Repository<Coupon>;

  public constructor(
    repositoryFactory: RepositoryFactory,
  ) {
    this.couponRepository = repositoryFactory.getCouponRepository();
  }

  public async validate(code?: string, id?: number): Promise<CouponOutputDTO> {
    if (!code && !id) {
      throw new Error("É necessário fornecer um código ou ID do cupom");
    }

    const whereConditions: any[] = [];

    if (code) {
      whereConditions.push({ code });
    }

    if (id) {
      whereConditions.push({ id });
    }

    const coupon = await this.couponRepository.findOne({
      where: whereConditions.length > 1 ? whereConditions : whereConditions[0]
    });

    if (!coupon) {
      throw new Error("Cupom não encontrado");
    }

    if (coupon.status !== "AVAILABLE") {
      throw new Error("Cupom não está disponível");
    }

    if (coupon.expiryDate < new Date()) {
      throw new Error("Cupom expirado");
    }

    return CouponMapper.entityToOutputDTO(coupon);
  }

  public async store(input: CreateCouponInputDTO): Promise<CouponOutputDTO> {
    const coupon = new Coupon(
      input.code,
      input.discount,
      input.type,
      input.status,
      input.expiryDate,
    );

    const created = await this.couponRepository.save(coupon);

    return CouponMapper.entityToOutputDTO(created);
  }
}
