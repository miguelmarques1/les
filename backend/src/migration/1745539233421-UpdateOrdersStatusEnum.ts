import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrdersStatusEnum1745539233421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE orders_status ADD VALUE IF NOT EXISTS 'REJECTED';
        `);
    await queryRunner.query(`
            ALTER TYPE orders_status ADD VALUE IF NOT EXISTS 'CANCELED';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE orders_status_old AS ENUM ('PROCESSING', 'APPROVED', 'SHIPPED', 'DELIVERED');
        `);
    await queryRunner.query(`
            ALTER TABLE orders
            ALTER COLUMN status TYPE orders_status_old
            USING status::text::orders_status_old;
        `);
    await queryRunner.query(`
            DROP TYPE orders_status;
        `);
    await queryRunner.query(`
            ALTER TYPE orders_status_old RENAME TO orders_status;
        `);
  }
}
