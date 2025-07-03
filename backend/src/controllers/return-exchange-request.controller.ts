import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { ReturnExchangeRequestService } from "../services/return-exchange-request.service";
import { CreateReturnExchangeRequestInputDTO } from "../dto/return-exchange-request.dto";

export class ReturnExchangeRequestController extends BaseController {
    private returnExchangeRequestService: ReturnExchangeRequestService;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.returnExchangeRequestService = new ReturnExchangeRequestService(repositoryFactory);
    }

    async store(req: Request, res: Response): Promise<any> {
        try {
            const input: CreateReturnExchangeRequestInputDTO = req.body;
            input.customer_id = parseInt(req['cus_id']);
            const output = await this.returnExchangeRequestService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async updateStatus(req: Request, res: Response): Promise<any> {
        try {
            const { status } = req.body;
            const returnExchangeRequestId = parseInt(req.params.id);
            const output = await this.returnExchangeRequestService.update(status, returnExchangeRequestId);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async findAll(req: Request, res: Response): Promise<any> {
        try {
            const output = await this.returnExchangeRequestService.findAll();
            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async findMine(req: Request, res: Response): Promise<any> {
        try {
            const customerId = parseInt(req['cus_id']);
            const output = await this.returnExchangeRequestService.findMine(customerId);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}