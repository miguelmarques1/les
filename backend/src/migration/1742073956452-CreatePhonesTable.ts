import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePhoneTable1742073956452 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE phone_type AS ENUM ('MOBILE', 'LANDLINE');

            CREATE TABLE phones (
                pho_id SERIAL PRIMARY KEY,
                pho_type phone_type NOT NULL,
                pho_ddd VARCHAR(2) NOT NULL,
                pho_number VARCHAR(13) NOT NULL,
                cus_id INTEGER NOT NULL,
                FOREIGN KEY (cus_id) REFERENCES customers(cus_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE phones;
            DROP TYPE phone_type;
        `);
    }

}
