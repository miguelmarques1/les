import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { RecommendationController } from "../controllers/recommendation.controller";
import { optionalAuth } from "../middlewares/optional-auth.middleware";

const Router = express.Router();
const recommendationController = new RecommendationController();

Router.post('/', optionalAuth, recommendationController.recommendations.bind(recommendationController));

export { Router as recommendationkRouter };