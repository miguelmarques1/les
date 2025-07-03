import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { CreateAddressInputDTO, DeleteAddressInputDTO, UpdateAddressInputDTO } from "../dto/address.dto";
import { CardService, CardServiceInterface } from "../services/card.service";
import { CreateCardInputDTO, DeleteCardInputDTO } from "../dto/card.dto";

export class CardController extends BaseController {
    private cardService: CardServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.cardService = new CardService(repositoryFactory);
    }

    async store(req: Request, res: Response): Promise<any> {
        try {
            const input: CreateCardInputDTO = req.body;
            input.customer_id = parseInt(req['cus_id']);
            const output = await this.cardService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async index(req: Request, res: Response) {
        try {
            const id = parseInt(req['cus_id']);

            const output = await this.cardService.index(id);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const input: DeleteCardInputDTO = {
                cardId: parseInt(req.params.id),
                customerId: parseInt(req['cus_id']),
            };
            const output = await this.cardService.delete(input);

            return super.success(res, output);
        } catch(e: any) {
            return super.error(res, e);
        }
    }
}
