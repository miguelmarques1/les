import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { CategoryController } from "../controllers/category.controller";

const Router = express.Router();
const categorycontroller = new CategoryController();

Router.get("/", categorycontroller.index.bind(categorycontroller));

export { Router as categoryRouter };