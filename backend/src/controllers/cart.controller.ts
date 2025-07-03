import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { CartService, CartServiceInterface } from "../services/cart.service";
import { AddToCartInputDTO } from "../dto/cart.dto";

export class CartController extends BaseController {
    private cartService: CartServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.cartService = new CartService(repositoryFactory);
    }

    async index(req: Request, res: Response) {
        try {
            const customerId = parseInt(req['cus_id']);
            const output = await this.cartService.show(customerId);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async store(req: Request, res: Response) {
        try {
            const input: AddToCartInputDTO = req.body;
            const customerId = parseInt(req['cus_id']);
            input.customer_id = customerId;

            const output = await this.cartService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const customerId = parseInt(req['cus_id']);
            const items = req.body.items;

            const output = await this.cartService.delete(items, customerId);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
