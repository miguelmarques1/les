import type { Request, Response } from "express"
import { BaseController } from "./base.controller"
import { RepositoryFactory } from "../factories/RepositoryFactory"
import {
  PrecificationGroupService,
  type PrecificationGroupServiceInterface,
} from "../services/precification-group.service"

export class PrecificationGroupController extends BaseController {
  private precificationGroupService: PrecificationGroupServiceInterface

  constructor() {
    super()
    const repositoryFactory = new RepositoryFactory()
    this.precificationGroupService = new PrecificationGroupService(repositoryFactory)
  }

  async getAll(req: Request, res: Response) {
    try {
      const output = await this.precificationGroupService.getAll()
      return super.success(res, output)
    } catch (e: any) {
      return super.error(res, e)
    }
  }
}
