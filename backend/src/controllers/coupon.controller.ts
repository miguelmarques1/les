import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { CouponService, CouponServiceInterface } from "../services/coupon.service";
import { CreateCouponInputDTO } from "../dto/coupon.dto";

export class CouponController extends BaseController {
    private couponService: CouponServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.couponService = new CouponService(repositoryFactory);
    }

    async validate(req: Request, res: Response) {
        try {
            const code = req.body.code;
            const output = await this.couponService.validate(code);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }

    async store(req: Request, res: Response) {
        try {
            const input: CreateCouponInputDTO = req.body;
            const output = await this.couponService.store(input);

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
