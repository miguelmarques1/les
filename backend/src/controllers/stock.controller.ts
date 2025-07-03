import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import {
  StockBookService,
  StockBookServiceInterface,
} from "../services/stock-book.service";
import { StockEntryInputDTO } from "../dto/stock-book.dto";

export class StockController extends BaseController {
  private stockBookService: StockBookServiceInterface;

  constructor() {
    super();
    const repositoryFactory = new RepositoryFactory();
    this.stockBookService = new StockBookService(repositoryFactory);
  }

  async index(req: Request, res: Response) {
    try {
      const query = req.query.query as string | null;
      const output = await this.stockBookService.index(query);

      return super.success(res, output);
    } catch (e: any) {
      return super.error(res, e);
    }
  }

  async show(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.id);
      const output = await this.stockBookService.show(bookId);

      return super.success(res, output);
    } catch (e: any) {
      return super.error(res, e);
    }
  }

  async store(req: Request, res: Response) {
    try {
      const input: StockEntryInputDTO = req.body;
      const output = await this.stockBookService.store(input);

      return super.success(res, output);
    } catch (e: any) {
      return super.error(res, e);
    }
  }
}
