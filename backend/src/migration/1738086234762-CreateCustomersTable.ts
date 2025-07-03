import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomersTable1738086234762 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE customer_status AS ENUM ('ACTIVE', 'INACTIVE');
        CREATE TYPE customer_gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
  
        CREATE TABLE customers (
          cus_id SERIAL PRIMARY KEY,
          cus_code VARCHAR(255) UNIQUE NOT NULL,
          cus_status customer_status NOT NULL,
          cus_password VARCHAR(255) NOT NULL,
          cus_email VARCHAR(255) UNIQUE NOT NULL,
          cus_gender customer_gender NOT NULL,
          cus_name VARCHAR(255) NOT NULL,
          cus_birthdate DATE NOT NULL,
          cus_document VARCHAR(14) UNIQUE NOT NULL,
          cus_ranking INTEGER NOT NULL,
          cus_created_at DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE customers;
        DROP TYPE customer_status;
        DROP TYPE customer_gender;
    `);
  }
}
