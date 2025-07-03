import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder"; // Importa a classe abstrata Seeder

export class BrandSeeder extends Seeder {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "brand" ("name")
      VALUES
        ('Visa'),
        ('MasterCard'),
        ('American Express'),
        ('Discover'),
        ('Elo'),
        ('Hipercard'),
        ('Aura'),
        ('JCB');
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "brand";`);
  }
}
