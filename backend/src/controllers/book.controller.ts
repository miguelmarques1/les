import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { BookService, BookServiceInterface } from "../services/book.service";
import { BookInputDTO } from "../dto/book.dto";

export class BookController extends BaseController {
    private bookService: BookServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.bookService = new BookService(repositoryFactory);
    }

    async store(req: Request, res: Response) {
        try {
            const input = req.body as BookInputDTO;
            const output = await this.bookService.store(input)
            return super.success(res, output, 201)
        } catch (e: any) {
            return super.error(res, e)
        }
    }

    async index(req: Request, res: Response) {
        try {
            const query = req.query.query as string | undefined;
            const output = await this.bookService.index(query);
            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
    
    async show(req: Request, res: Response) {
        try {
            const bookIdStr = req.params.id;
            const bookId = Number.parseInt(bookIdStr);
            const output = await this.bookService.show(bookId);
            return super.success(res, output);
        } catch(e: any) {
            return super.error(res, e);
        }
    }

    async showCustomerInterest(req: Request, res: Response) {
        try {
            const customerIdStr = req.params.customerId;
            const customerId = Number.parseInt(customerIdStr);
            const output = await this.bookService.getCustomerInterest(customerId);
            return super.success(res, output);
        } catch(e: any) {
            return super.error(res, e);
        }
    }
    
    async booksByCategory(req: Request, res: Response) {
        try {
            const categoryIdStr = req.params.categoryId;
            const categoryId = Number.parseInt(categoryIdStr);
            const output = await this.bookService.getBooksByCategory(categoryId);
            return super.success(res, output);
        } catch(e: any) {
            return super.error(res, e);
        }
    }

    async booksByIDs(req: Request, res: Response) {
        try {
            const ids = req.body.ids as number[];
            const output = await this.bookService.getByIds(ids);
            return super.success(res, output);
        } catch(e: any) {
            return super.error(res, e);
        }
    }
}