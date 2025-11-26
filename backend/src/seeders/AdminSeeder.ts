import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder";
import { encrypt } from "../helpers/encrypt";

export class AdminSeeder extends Seeder {
  async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = encrypt.encryptpass("admin123");

    await queryRunner.query(`
      INSERT INTO "admins" ("id", "email", "name", "role", "permissions", "passwordPassword_hash")
      VALUES
        (1, 'admin@admin.com', 'Miguel Este', 'SUPER_ADMIN', '["manage:coupons", "manage:brands", "manage:orders", "manage:users", "manage:returns"]', $1)
      ON CONFLICT DO NOTHING;
    `, [passwordHash]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "admins" WHERE email = 'admin@admin.com';`);
  }
}
