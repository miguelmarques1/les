import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder";

export class PrecificationGroupSeeder extends Seeder {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "precification_group" ("profitPercentage", "name")
      VALUES
        (10.0, 'Bronze'),
        (15.0, 'Prata'),
        (20.0, 'Ouro'),
        (25.0, 'Platina');
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "precification_group";`);
  }
}
