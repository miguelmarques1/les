import { Coupon } from "../domain/entity/Coupon";
import { CouponOutputDTO } from "../dto/coupon.dto";

export class CouponMapper {
  static entityToOutputDTO(coupon: Coupon): CouponOutputDTO {
    return new CouponOutputDTO(
      coupon.id,
      coupon.code,
      Number(coupon.discount),
      coupon.type,
      coupon.status,
      coupon.expiryDate
    );
  }
}
