import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { CartController } from "../controllers/cart.controller";

const Router = express.Router();
const cartController = new CartController();

Router.get("/", authentification, cartController.index.bind(cartController));
Router.post("/add", authentification, cartController.store.bind(cartController));
Router.delete("/", authentification, cartController.delete.bind(cartController));

export { Router as cartRouter };
