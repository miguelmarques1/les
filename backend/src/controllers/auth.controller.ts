import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AuthService, AuthServiceInterface } from "../services/auth.service";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { AuthInputDTO } from "../dto/auth.dto";

export class AuthController extends BaseController {
  private authService: AuthServiceInterface;
  
    constructor() {
      super();
      const repositoryFactory = new RepositoryFactory();
      this.authService = new AuthService(repositoryFactory);
    }

  async login(req: Request, res: Response): Promise<any> {
    try {
      const input: AuthInputDTO = req.body;

      const output = await this.authService.login(input);

      return super.success(res, output);
    } catch(e: any) {
      return super.error(res, e);
    }
  }
}