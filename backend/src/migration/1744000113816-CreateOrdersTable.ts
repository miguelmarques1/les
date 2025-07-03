import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1744000113816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE orders_status AS ENUM ('PROCESSING', 'APPROVED', 'SHIPPED', 'DELIVERED');

            CREATE TABLE orders (
                ord_id SERIAL PRIMARY KEY,
                ord_status orders_status NOT NULL,
                cus_id INTEGER NOT NULL,
                add_id INTEGER NOT NULL,
                ord_date DATE NOT NULL DEFAULT CURRENT_DATE,
                FOREIGN KEY (add_id) REFERENCES addresses(add_id),
                FOREIGN KEY (cus_id) REFERENCES customers(cus_id)
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders";`);
        await queryRunner.query(`DROP TYPE "orders_status";`);
    }

}
