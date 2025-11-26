import { createConnection } from "typeorm";
import { BrandSeeder } from "./BrandSeeder";
import { CategorySeeder } from "./CategorySeeder";
import { PrecificationGroupSeeder } from "./PrecificationGroupSeeder";
import { AppDataSource } from "../data-source";
import { BookSeeder } from "./BookSeeder";
import { BookCategorySeeder } from "./BookCategorySeeder";
import { Seeder } from "./interface/Seeder";
import { CouponSeeder } from "./CouponSeeder";
import { AdminSeeder } from "./AdminSeeder";

const seeds: Seeder[] = [
  new AdminSeeder(),
];

async function runSeeder() {
  const connection = await AppDataSource.initialize();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    for (const seed of seeds) {
      await seed.down(queryRunner);
      await seed.up(queryRunner);
    }

    await queryRunner.commitTransaction(); 
  } catch (error) {
    await queryRunner.rollbackTransaction(); 
    console.error("Erro ao rodar o seeder: ", error);
  } finally {
    await queryRunner.release();
    await connection.close();
  }
}

runSeeder();
