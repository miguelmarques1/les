import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCouponsTable1743995947699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "coupon_type_enum" AS ENUM ('PERCENTAGE', 'VALUE');
    `);

    await queryRunner.query(`
      CREATE TYPE "coupon_status_enum" AS ENUM ('AVAILABLE', 'USED', 'EXPIRED');
    `);

    await queryRunner.query(`
      CREATE TABLE "coupons" (
        "cou_id" SERIAL PRIMARY KEY,
        "cou_code" VARCHAR(255) UNIQUE NOT NULL,
        "cou_discount" DOUBLE PRECISION NOT NULL,
        "cou_type" coupon_type_enum NOT NULL,
        "cou_status" coupon_status_enum NOT NULL DEFAULT 'AVAILABLE',
        "cou_expiry_date" TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "coupons";`);
    await queryRunner.query(`DROP TYPE "coupon_status_enum";`);
    await queryRunner.query(`DROP TYPE "coupon_type_enum";`);
  }
}
