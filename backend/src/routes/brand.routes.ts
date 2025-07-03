import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { BrandController } from "../controllers/brand.controller";

const Router = express.Router();
const brandController = new BrandController();

Router.get("/", authentification, brandController.index.bind(brandController));

export { Router as brandRouter };