import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBooksTable1742870270938 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Criando o tipo ENUM antes de usá-lo
            CREATE TYPE "book_status" AS ENUM ('ACTIVE', 'INACTIVE');

            CREATE TABLE "books" (
                "bok_id" SERIAL PRIMARY KEY,
                "bok_status" book_status NOT NULL,
                "pgp_id" INTEGER NOT NULL,
                "bok_author" VARCHAR(255) NOT NULL,
                "bok_year" INTEGER NOT NULL,
                "bok_title" VARCHAR(255) NOT NULL,
                "bok_publisher" VARCHAR(255) NOT NULL,
                "bok_edition" INTEGER NOT NULL,
                "bok_isbn" VARCHAR(18) NOT NULL UNIQUE,
                "bok_pages" INTEGER NOT NULL,
                "bok_synopsis" TEXT,
                "bok_height" DOUBLE PRECISION,
                "bok_width" DOUBLE PRECISION,
                "bok_weight" DOUBLE PRECISION,
                "bok_depth" DOUBLE PRECISION,
                CONSTRAINT "fk_books_precification_group" FOREIGN KEY ("pgp_id") 
                REFERENCES "precification_groups"("pgp_id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TYPE "book_status"`);
    }
}
