import { QueryRunner } from "typeorm";
import { Seeder } from "./interface/Seeder";

export class BookSeeder extends Seeder {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "book" (
          "status", 
          "precificationGroupId", 
          "author", 
          "year", 
          "title", 
          "publisher", 
          "edition", 
          "isbnIsbn_code", 
          "pages", 
          "synopsis", 
          "height", 
          "width", 
          "weight", 
          "depth"
      ) VALUES
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Bronze'), 'J.K. Rowling', 1997, 'Harry Potter and the Philosopher''s Stone', 'Bloomsbury', 1, 'ISBN 9780747532699', 223, 'A young wizard embarks on a journey to defeat a dark force.', 20.0, 15.0, 0.5, 2.0),
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Prata'), 'J.R.R. Tolkien', 1954, 'The Fellowship of the Ring', 'George Allen & Unwin', 1, 'ISBN 9780618574940', 423, 'A young hobbit joins a group on a quest to destroy a powerful ring.', 22.5, 15.0, 0.8, 2.5),
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Ouro'), 'George Orwell', 1949, '1984', 'Secker & Warburg', 1, 'ISBN 9780451524935', 328, 'A dystopian society controlled by an omnipresent government.', 21.0, 13.5, 0.6, 2.0),
      ('INACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Ouro'), 'Aldous Huxley', 1932, 'Brave New World', 'Chatto & Windus', 1, 'ISBN 9780060850524', 311, 'A futuristic society in which people are engineered for specific roles.', 21.5, 14.0, 0.55, 2.1),
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Bronze'), 'F. Scott Fitzgerald', 1925, 'The Great Gatsby', 'Charles Scribner''s Sons', 1, 'ISBN 9780743273565', 180, 'A story about the American dream and a tragic romance set in the 1920s.', 19.0, 14.0, 0.45, 1.8),
      ('INACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Prata'), 'Harper Lee', 1960, 'To Kill a Mockingbird', 'J.B. Lippincott & Co.', 1, 'ISBN 9780061120084', 281, 'A novel of racial injustice in the American South during the 1930s.', 20.0, 14.0, 0.5, 1.9),
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Bronze'), 'Jane Austen', 1813, 'Pride and Prejudice', 'T. Egerton', 1, 'ISBN 9780141040349', 432, 'A classic romance novel dealing with the issues of class, marriage, and manners.', 22.0, 14.5, 0.6, 2.0),
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Prata'), 'Mark Twain', 1884, 'The Adventures of Huckleberry Finn', 'Chatto & Windus', 1, 'ISBN 9780142437179', 366, 'A boy and an escaped slave embark on a journey down the Mississippi River.', 23.0, 15.0, 0.7, 2.4),
      ('INACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Ouro'), 'Leo Tolstoy', 1869, 'War and Peace', 'The Russian Messenger', 1, 'ISBN 9780143039990', 1296, 'A novel of Russian society during the Napoleonic wars.', 25.0, 16.5, 1.1, 3.0),
      ('ACTIVE', (SELECT "id" FROM "precification_group" WHERE "name" = 'Bronze'), 'Charles Dickens', 1859, 'A Tale of Two Cities', 'Chapman & Hall', 1, 'ISBN 9781853260391', 544, 'A story of love and sacrifice set during the French Revolution.', 21.5, 14.0, 0.65, 2.2);
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "book";`);
  }
}
