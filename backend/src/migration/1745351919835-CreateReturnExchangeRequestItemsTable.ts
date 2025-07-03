import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExchangeRequestItemsTable1745351919835 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE return_exchange_request_items (
                rei_id SERIAL PRIMARY KEY,
                ori_id INTEGER,
                rer_id INTEGER NOT NULL,
                CONSTRAINT fk_order_item FOREIGN KEY (ori_id) REFERENCES order_items(ori_id),
                CONSTRAINT fk_return_exchange_request FOREIGN KEY (rer_id) REFERENCES return_exchange_requests(rer_id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS return_exchange_request_items`);
    }
}
