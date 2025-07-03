import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { RecommendationController } from "../controllers/recommendation.controller";

const Router = express.Router();
const recommendationController = new RecommendationController();

Router.post('/', recommendationController.recommendations.bind(recommendationController));

export { Router as recommendationkRouter };