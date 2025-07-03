import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartItemsTable1743727881886 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE CartItems (
        "cai_id" SERIAL PRIMARY KEY,
        "soi_id" INTEGER NOT NULL,
        "car_id" INTEGER NOT NULL,
        "cai_entry_date" DATE NOT NULL,
        FOREIGN KEY ("soi_id") REFERENCES stockbooks("soi_id"),
        FOREIGN KEY ("car_id") REFERENCES carts("car_id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CartItem";`);
  }

}
