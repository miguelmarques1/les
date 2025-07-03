import { Router } from "express";
import { RecommendationController } from "../controllers/recommendation.controller";
import { RecommendationService } from "../services/recommendation.service";

const router = Router();
const service = new RecommendationService();
const controller = new RecommendationController(service);

router.post('/recommendations', controller.handle.bind(controller));

export { router };