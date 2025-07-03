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
            const output = await this.adminService.dashboard();
        
            super.success(res, output);
        } catch (error) {
            super.error(res, error);
        }
    }
}              