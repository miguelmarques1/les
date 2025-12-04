import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Book } from "../domain/entity/Book";
import { BookState } from "../domain/enums/BookState";

const CRON_ENABLED = process.env.CRON_ENABLED === "true";

export function startBookVerification() {
  if (!CRON_ENABLED) {
    console.log("Cron job desativado. Nada será executado.");
    return;
  }

  cron.schedule("0 * * * *", async () => {
    const repo = AppDataSource.getRepository(Book);
    const books = await repo.find();


    for(let book of books) {
        book.status =  book.stockBooks.length > 0 ? BookState.ACTIVE : BookState.INACTIVE;
        await repo.save(book);
    }
  });
}
