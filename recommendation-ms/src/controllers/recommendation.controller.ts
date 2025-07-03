import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RecommendationService } from "../services/recommendation.service";
import { RecommendationsRequest } from "../models/interfaces";

export class RecommendationController extends BaseController {
    private recommendationService: RecommendationService;

    constructor(recommendationService: RecommendationService) {
        super();
        this.recommendationService = recommendationService;
    }

    public async handle(req: Request, res: Response) {
        try {
            const input: RecommendationsRequest = req.body as RecommendationsRequest;

            const output = await this.recommendationService.execute(input);

            return super.success(res, output);
        } catch(e) {
            return super.error(res, e);
        }
    }
}