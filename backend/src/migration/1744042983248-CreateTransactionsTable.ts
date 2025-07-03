import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTable1744042983248 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "transactions" (
            tra_id SERIAL PRIMARY KEY,
            tra_amount DOUBLE PRECISION NOT NULL,
            ord_id INTEGER NOT NULL,
            cad_id INTEGER NOT NULL,
            cou_id INTEGER NULL,
            tra_date DATE NOT NULL DEFAULT CURRENT_DATE,
            FOREIGN KEY (ord_id) REFERENCES orders(ord_id),
            FOREIGN KEY (cad_id) REFERENCES cards(cad_id),
            FOREIGN KEY (cou_id) REFERENCES coupons(cou_id)
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions";`);
    }
}
