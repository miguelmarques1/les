import { TransactionService, TransactionServiceInterface } from "../services/transaction.service";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { Request, Response } from "express";
import { UpdateTransactionInputDTO } from "../dto/transaction.dto";

export class TransactionController extends BaseController {
    private transactionService: TransactionServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.transactionService = new TransactionService(repositoryFactory);
    }

    async update(req: Request, res: Response) {
        try {
            const input = req.body as UpdateTransactionInputDTO;

            await this.transactionService.update(input);

            return super.success(res, {});
        } catch(e) {
            return super.error(res, e);
        }
    }
}