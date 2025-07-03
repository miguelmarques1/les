import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { OrderService, OrderServiceInterface } from "../services/order.service";
import { CreateOrderInputDTO, UpdateOrderStatusInputDTO } from "../dto/order.dto";

export class OrderController extends BaseController {
    private orderService: OrderServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.orderService = new OrderService(repositoryFactory);
    }

    async show(req: Request, res: Response) {
        try {
            const orderId = parseInt(req.params.id);

            const order = await this.orderService.show(orderId);

            return super.success(res, order);
        } catch (e: any) {
            super.error(res, e);
        }
    }

    async store(req: Request, res: Response) {
        try {
            const customerId = parseInt(req['cus_id']);
            const input: CreateOrderInputDTO = req.body;
            input.customer_id = customerId;

            const output = await this.orderService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            console.log((e as Error).stack)
            return super.error(res, e);
        }
    }

    async index(req: Request, res: Response) {
        try {
            const customerId = parseInt(req['cus_id']);

            const output = await this.orderService.index(customerId);

            return super.success(res, output);
        } catch (e: any) {
            console.log((e as Error).stack)
            return super.error(res, e);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const orderId = parseInt(req.params.id);
            const input: UpdateOrderStatusInputDTO = req.body;
            input.order_id = orderId;

            const output = await this.orderService.update(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async all(req: Request, res: Response) {
        try {
            const output = await this.orderService.all();

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
