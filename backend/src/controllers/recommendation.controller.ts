import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RecommendationService } from "../services/recommendation.service";
import { RecommendationsRequest } from "../dto/recommendation.dto";

export class RecommendationController extends BaseController {
  private recommendationService: RecommendationService;

  constructor() {
    super();
    this.recommendationService = new RecommendationService();
  }

  async recommendations(req: Request, res: Response) {
    try {
      const customerID = parseInt(req['cus_id']);
      const input = req.body as RecommendationsRequest;
      input.customerID = customerID;
      
      console.log('look at the input sended to recommendation ms');
      console.log(input);
      const output = await this.recommendationService.handle(input);

      return super.success(res, output);
    } catch(e: any) {
      return super.error(res, e);
    }
  }
}
