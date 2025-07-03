import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCardsTable1741661643311 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE cards (
                cad_id SERIAL PRIMARY KEY,
                cad_number VARCHAR(16) NOT NULL UNIQUE,
                cad_holder_name VARCHAR(255) NOT NULL,
                bra_id INTEGER NOT NULL,
                cad_cvv VARCHAR(3) NOT NULL,
                cus_id INTEGER NOT NULL,
                CONSTRAINT fk_cards_brand FOREIGN KEY (bra_id) REFERENCES brands(bra_id) ON DELETE CASCADE,
                CONSTRAINT fk_cards_customer FOREIGN KEY (cus_id) REFERENCES customers(cus_id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE cards;`);
    }
}
