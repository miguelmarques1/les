import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AdminService, AdminServiceInterface } from "../services/admin.service";
import { RepositoryFactory } from "../factories/RepositoryFactory";

export class AdminController extends BaseController {
    private adminService: AdminServiceInterface;

    public constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.adminService = new AdminService(repositoryFactory);
    }

    async authenticate(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const output = await this.adminService.authenticate(email, password);
        
            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async dashboard(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;

            let start: Date | undefined;
            let end: Date | undefined;

            if (startDate && typeof startDate === 'string') {
                start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    throw new Error("startDate inválida. Use formato YYYY-MM-DD");
                }
            }

            if (endDate && typeof endDate === 'string') {
                end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    throw new Error("endDate inválida. Use formato YYYY-MM-DD");
                }
            }

            const output = await this.adminService.dashboard(start, end);
        
            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async createCoupon(req: Request, res: Response): Promise<void> {
        try {
            const { code, discount, type, status, expiryDate } = req.body;

            const output = await this.adminService.createCoupon({
                code,
                discount,
                type,
                status,
                expiryDate: new Date(expiryDate)
            });

            super.success(res, output, 201);
        } catch (error) {
            super.error(res, error);
        }
    }

    async toggleCouponStatus(req: Request, res: Response): Promise<void> {
        try {
            const { couponId } = req.params;
            const { status } = req.body;

            const output = await this.adminService.toggleCouponStatus(parseInt(couponId), status);

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async listCoupons(req: Request, res: Response): Promise<void> {
        try {
            const output = await this.adminService.listCoupons();

            super.success(res, output);
        } catch(error) {
            super.error(res, error);
        }
    }

    async createBrand(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;

            const output = await this.adminService.createBrand(name);

            super.success(res, output, 201);
        } catch (error) {
            super.error(res, error);
        }
    }

    async deleteBrand(req: Request, res: Response): Promise<void> {
        try {
            const { brandId } = req.params;

            const result = await this.adminService.deleteBrand(parseInt(brandId));

            if (result) {
                super.success(res, { message: "Bandeira deletada com sucesso" });
            } else {
                super.error(res, new Error("Falha ao deletar bandeira"));
            }
        } catch (error) {
            super.error(res, error);
        }
    }

    async listBrands(req: Request, res: Response): Promise<void> {
        try {
            const output = await this.adminService.listBrands();

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async listOrders(req: Request, res: Response): Promise<void> {
        try {
            const output = await this.adminService.listOrders();

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async getOrderDetails(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;

            const output = await this.adminService.getOrderDetails(parseInt(orderId));

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async listUsers(req: Request, res: Response): Promise<void> {
        try {
            const output = await this.adminService.listUsers();

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async listReturns(req: Request, res: Response): Promise<void> {
        try {
            const output = await this.adminService.listReturns();

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }

    async updateReturnStatus(req: Request, res: Response): Promise<void> {
        try {
            const { returnId } = req.params;
            const { status } = req.body;

            const output = await this.adminService.updateReturnStatus(parseInt(returnId), status);

            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }
}
