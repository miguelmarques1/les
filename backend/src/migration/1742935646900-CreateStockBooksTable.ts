import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStockBooksTable1742935646900 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE stock_status AS ENUM ('AVAILABLE', 'SOLD', 'BLOCKED');

            CREATE TABLE StockBooks (
                soi_id SERIAL PRIMARY KEY,
                bok_id INTEGER NOT NULL,
                soi_code VARCHAR(255) NOT NULL UNIQUE,
                soi_entry_date DATE NOT NULL,
                soi_supplier VARCHAR(255),
                soi_costs_value DOUBLE PRECISION NOT NULL,
                soi_status stock_status NOT NULL,
                soi_sale_date DATE NULL,
                CONSTRAINT fk_stockbooks_books FOREIGN KEY (bok_id) REFERENCES Books(bok_id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE StockBooks;
            DROP TYPE stock_status;
        `);
    }
}
