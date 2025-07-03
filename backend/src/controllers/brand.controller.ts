import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { AddressService, AddressServiceInterface } from "../services/address.service";
import { CreateAddressInputDTO, DeleteAddressInputDTO, UpdateAddressInputDTO } from "../dto/address.dto";
import { BrandService, BrandServiceInterface } from "../services/brand.service";

export class BrandController extends BaseController {
    private brandService: BrandServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.brandService = new BrandService(repositoryFactory);
    }

    async index(req: Request, res: Response) {
        try {
            const output = await this.brandService.index();

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
