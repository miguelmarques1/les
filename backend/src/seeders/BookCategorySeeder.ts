import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder";

export class BookCategorySeeder extends Seeder {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "book_categories" ("book_id", "category_id")
        VALUES
          -- Harry Potter: Fantasia, Ficção
          ((SELECT "id" FROM "book" WHERE "title" = 'Harry Potter and the Philosopher''s Stone'),
           (SELECT "id" FROM "category" WHERE "name" = 'Fantasia')),
          ((SELECT "id" FROM "book" WHERE "title" = 'Harry Potter and the Philosopher''s Stone'),
           (SELECT "id" FROM "category" WHERE "name" = 'Ficção')),

          -- O Senhor dos Anéis: Fantasia, Aventura
          ((SELECT "id" FROM "book" WHERE "title" = 'The Fellowship of the Ring'),
           (SELECT "id" FROM "category" WHERE "name" = 'Fantasia')),
          ((SELECT "id" FROM "book" WHERE "title" = 'The Fellowship of the Ring'),
           (SELECT "id" FROM "category" WHERE "name" = 'Histórico')),

          -- 1984: Ficção, Suspense
          ((SELECT "id" FROM "book" WHERE "title" = '1984'),
           (SELECT "id" FROM "category" WHERE "name" = 'Ficção')),
          ((SELECT "id" FROM "book" WHERE "title" = '1984'),
           (SELECT "id" FROM "category" WHERE "name" = 'Suspense')),

          -- Brave New World: Ficção, Distopia
          ((SELECT "id" FROM "book" WHERE "title" = 'Brave New World'),
           (SELECT "id" FROM "category" WHERE "name" = 'Ficção')),
          ((SELECT "id" FROM "book" WHERE "title" = 'Brave New World'),
           (SELECT "id" FROM "category" WHERE "name" = 'Suspense')),

          -- O Grande Gatsby: Drama, Romance
          ((SELECT "id" FROM "book" WHERE "title" = 'The Great Gatsby'),
           (SELECT "id" FROM "category" WHERE "name" = 'Drama')),
          ((SELECT "id" FROM "book" WHERE "title" = 'The Great Gatsby'),
           (SELECT "id" FROM "category" WHERE "name" = 'Romance')),

          -- Orgulho e Preconceito: Romance, Drama
          ((SELECT "id" FROM "book" WHERE "title" = 'Pride and Prejudice'),
           (SELECT "id" FROM "category" WHERE "name" = 'Romance')),
          ((SELECT "id" FROM "book" WHERE "title" = 'Pride and Prejudice'),
           (SELECT "id" FROM "category" WHERE "name" = 'Drama')),

          -- Huck Finn: Histórico, Aventura
          ((SELECT "id" FROM "book" WHERE "title" = 'The Adventures of Huckleberry Finn'),
           (SELECT "id" FROM "category" WHERE "name" = 'Histórico')),
          ((SELECT "id" FROM "book" WHERE "title" = 'The Adventures of Huckleberry Finn'),
           (SELECT "id" FROM "category" WHERE "name" = 'Ficção')),

          -- Guerra e Paz: Histórico, Drama
          ((SELECT "id" FROM "book" WHERE "title" = 'War and Peace'),
           (SELECT "id" FROM "category" WHERE "name" = 'Histórico')),
          ((SELECT "id" FROM "book" WHERE "title" = 'War and Peace'),
           (SELECT "id" FROM "category" WHERE "name" = 'Drama')),

          -- Um Conto de Duas Cidades: Histórico, Ficção
          ((SELECT "id" FROM "book" WHERE "title" = 'A Tale of Two Cities'),
           (SELECT "id" FROM "category" WHERE "name" = 'Histórico')),
          ((SELECT "id" FROM "book" WHERE "title" = 'A Tale of Two Cities'),
           (SELECT "id" FROM "category" WHERE "name" = 'Ficção'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "book_categories";`);
  }
}
