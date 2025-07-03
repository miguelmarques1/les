import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBrandsTable1741661470266 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE brands (
                bra_id SERIAL PRIMARY KEY,
                bra_name VARCHAR(255) NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE brands;`);
    }
}
