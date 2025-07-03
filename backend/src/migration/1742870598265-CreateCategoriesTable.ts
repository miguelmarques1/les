import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoriesTable1742870598265 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "cat_id" SERIAL PRIMARY KEY,
                "cat_name" VARCHAR(255) NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories";`);
    }
}
