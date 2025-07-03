import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { CategoryService, CategoryServiceInterface } from "../services/category.service";

export class CategoryController extends BaseController {
    private categoryService: CategoryServiceInterface;

    constructor() {
        super();
        const repositoryFactory = new RepositoryFactory();
        this.categoryService = new CategoryService(repositoryFactory);
    }

    async index(req: Request, res: Response) {
        try {
            const output = await this.categoryService.index();

            return super.success(res, output);
        } catch (e: any) {
            return super.error(res, e);
        }
    }
}
