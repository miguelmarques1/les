import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { AddressService, AddressServiceInterface } from "../services/address.service";
import { CreateAddressInputDTO, DeleteAddressInputDTO, UpdateAddressInputDTO } from "../dto/address.dto";

export class AddressController extends BaseController {
    private addressService: AddressServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.addressService = new AddressService(repositoryFactory);
    }

    async store(req: Request, res: Response): Promise<any> {
        try {
            const input: CreateAddressInputDTO = req.body;
            input.customerId = parseInt(req['cus_id']);
            const output = await this.addressService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async index(req: Request, res: Response) {
        try {
            const id = parseInt(req['cus_id']);

            const output = await this.addressService.index(id);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const input: UpdateAddressInputDTO = req.body;
            input.addressId = parseInt(req.params.id);
            input.customerId = parseInt(req['cus_id']);

            const output = await this.addressService.update(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const input: DeleteAddressInputDTO = {
                addressId: parseInt(req.params.id),
                customerId: parseInt(req['cus_id']),
            };
            const output = await this.addressService.delete(input);

            return super.success(res, output);
        } catch(e: any) {
            return super.error(res, e);
        }
    }
}
