import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert } from "typeorm";
import { CouponStatus } from "../enums/CouponStatus";
import { CouponType } from "../enums/CouponType";
import { fromValue } from "../utils/fromValue";
import { DefaultValidation } from "../validation/DefaultValidation";

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('decimal')
  discount: number;

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @Column({ type: 'enum', enum: CouponStatus })
  status: CouponStatus;

  @Column()
  expiryDate: Date;

  constructor(
    code: string,
    discount: number,
    type: string,
    status: string,
    expiryDate: Date
  ) {
    this.code = code;
    this.discount = discount;
    this.type = fromValue(CouponType, type);
    this.status = fromValue(CouponStatus, status);
    this.expiryDate = expiryDate;
  }

  @BeforeInsert()
  @BeforeUpdate()
  validate(): void {
    DefaultValidation.strDefaultLenght(this.code, "Invalid coupon code");
    DefaultValidation.numNotNegative(this.discount, "Invalid coupon discount value");

    if (!this.type) {
      throw new Error("Invalid coupon type");
    }

    if (!this.status) {
      throw new Error("Invalid coupon status");
    }
  }
}