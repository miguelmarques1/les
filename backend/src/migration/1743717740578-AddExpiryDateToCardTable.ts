import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExpiryDateToCardTable1743717740578 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "cards"
            ADD COLUMN "cad_expiry_date" VARCHAR(10) NOT NULL DEFAULT '00/00'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "cards"
            DROP COLUMN "cad_expiry_date"
        `);
    }
}