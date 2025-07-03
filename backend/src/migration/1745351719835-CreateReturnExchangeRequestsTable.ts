import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExchangeRequestsTable1745351719835
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'return_exchange_request_status') THEN
                    CREATE TYPE return_exchange_request_status AS ENUM (
                        'EXCHANGE_REQUESTED',
                        'EXCHANGE_ACCEPTED',
                        'EXCHANGE_REJECTED',
                        'EXCHANGE_COMPLETED',
                        'RETURN_REQUESTED',
                        'RETURN_REJECTED',
                        'RETURN_COMPLETED'
                    );
                END IF;
            END $$;
        `);

    await queryRunner.query(`
            CREATE TABLE return_exchange_requests (
                rer_id SERIAL PRIMARY KEY,
                rer_description TEXT NOT NULL,
                cus_id INTEGER NOT NULL,
                rer_status return_exchange_request_status NOT NULL,
                rer_created_at TIMESTAMP DEFAULT now(),
                rer_updated_at TIMESTAMP DEFAULT now(),
                CONSTRAINT fk_customer FOREIGN KEY (cus_id) REFERENCES customers(cus_id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS return_exchange_requests`);
    await queryRunner.query(`DROP TYPE IF EXISTS return_exchange_request_status`);
  }
}
