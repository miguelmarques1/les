import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartsTable1743726187619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE Carts(
              "car_id" SERIAL PRIMARY KEY,
              "cus_id" INTEGER NOT NULL UNIQUE,
              FOREIGN KEY ("cus_id") REFERENCES customers("cus_id")
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Cart";`);
    }

}
