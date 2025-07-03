import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderItemsTable1744000266178 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE order_items (
                ori_id SERIAL PRIMARY KEY,
                ord_id INTEGER NOT NULL,
                soi_id INTEGER NOT NULL,
                FOREIGN KEY (ord_id) REFERENCES orders(ord_id),
                FOREIGN KEY (soi_id) REFERENCES stockbooks(soi_id)
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_items";`);
    }
}
