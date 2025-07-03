import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookCategoriesTable1742870634638 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "book_categories" (
                "bok_id" INTEGER NOT NULL,
                "cat_id" INTEGER NOT NULL,
                PRIMARY KEY ("bok_id", "cat_id"),
                CONSTRAINT "fk_bookcategory_book" FOREIGN KEY ("bok_id") 
                    REFERENCES "books" ("bok_id") ON DELETE CASCADE,
                CONSTRAINT "fk_bookcategory_category" FOREIGN KEY ("cat_id") 
                    REFERENCES "categories" ("cat_id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book_categories";`);
    }
}
