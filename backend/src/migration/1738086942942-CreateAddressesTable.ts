import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddressesTable1738086942942 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE address_type AS ENUM ('BILLING', 'SHIPPING');
        CREATE TYPE residence_type AS ENUM ('HOUSE', 'APARTMENT');

        CREATE TABLE addresses (
            add_id SERIAL PRIMARY KEY,
            add_alias VARCHAR(255),
            add_type address_type NOT NULL,
            add_residence_type residence_type NOT NULL,
            add_street_type VARCHAR(50) NOT NULL,
            add_street VARCHAR(255) NOT NULL,
            add_number VARCHAR(10) NOT NULL,
            add_district VARCHAR(255) NOT NULL,
            add_zipcode VARCHAR(10) NOT NULL,
            add_city VARCHAR(255) NOT NULL,
            add_state VARCHAR(255) NOT NULL,
            add_country VARCHAR(255) NOT NULL,
            add_observations TEXT,
            cus_id INTEGER NOT NULL,
            FOREIGN KEY (cus_id) REFERENCES customers(cus_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE addresses;
        DROP TYPE address_type;
        DROP TYPE residence_type;
    `);
  }
}
