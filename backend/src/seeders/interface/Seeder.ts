import { QueryRunner } from "typeorm";

export abstract class Seeder {
  public abstract up(queryRunner: QueryRunner): Promise<void>;

  public abstract down(queryRunner: QueryRunner): Promise<void>;
}
