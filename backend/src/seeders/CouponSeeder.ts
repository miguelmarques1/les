import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder";

export class CouponSeeder extends Seeder {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "coupon" (
        "code", 
        "discount", 
        "type", 
        "status", 
        "expiryDate"
      ) VALUES
        ('WELCOME10', 10.0, 'PERCENTAGE', 'AVAILABLE', NOW() + INTERVAL '30 days'),
        ('SAVE50', 50.0, 'VALUE', 'AVAILABLE', NOW() + INTERVAL '15 days'),
        ('FREESHIP', 100.0, 'PERCENTAGE', 'USED', NOW() - INTERVAL '1 day'),
        ('EXPIRED20', 20.0, 'VALUE', 'EXPIRED', NOW() - INTERVAL '10 days'),
        ('HOLIDAY25', 25.0, 'PERCENTAGE', 'AVAILABLE', NOW() + INTERVAL '60 days');
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "coupon";`);
  }
}
