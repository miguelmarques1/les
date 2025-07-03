import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePrecificationGroupsTable1742870196184 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "precification_groups" (
                "pgp_id" SERIAL PRIMARY KEY,
                "pgp_profit_percentage" DOUBLE PRECISION NOT NULL,
                "pgp_name" VARCHAR(255) NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "precification_groups"`);
    }
}
