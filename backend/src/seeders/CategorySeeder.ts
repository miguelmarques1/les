import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder"; // Importa a classe abstrata Seeder

export class CategorySeeder extends Seeder {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "category" ("name")
      VALUES
        ('Ficção'),
        ('Romance'),
        ('Suspense'),
        ('Terror'),
        ('Fantasia'),
        ('Histórico'),
        ('Biografia'),
        ('Ciência Fiction'),
        ('Drama'),
        ('Poesia');
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "category";`);
  }
}
