import { Request, Response } from "express";
import { CustomerService, CustomerServiceInterface } from "../services/customer.service";
import { BaseController } from "./base.controller";
import { RepositoryFactory } from "../factories/RepositoryFactory";
import { CreateCustomerInputDTO, UpdateCustomerInputDTO } from "../dto/customer.dto";

export class CustomerController extends BaseController {
  private customerService: CustomerServiceInterface;

  constructor() {
    super();
    const repositoryFactory = new RepositoryFactory();
    this.customerService = new CustomerService(repositoryFactory); 
  }

  async store(req: Request, res: Response): Promise<any> {
    try {
      const input: CreateCustomerInputDTO = req.body;
      const output = await this.customerService.store(input);
    
      return super.success(res, output);
    } catch (e: any) {
      console.log((e as Error).stack)
      return super.error(res, e);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const id = parseInt(req['cus_id']);

      const output = await this.customerService.show(id);

      return super.success(res, output);
    } catch(e: any) {
      return super.error(res, e);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req['cus_id']); 
      const input: UpdateCustomerInputDTO = req.body;
      
      const output = await this.customerService.update(id, input);
      
      return super.success(res, output);
    } catch(e: any) {
      return super.error(res, e);
    }
  }

  async delete(req: Request, res: Response) {}
}
