import * as express from "express";
import { OrderController } from "../controllers/order.controller";
import { authentification } from "../middlewares/authentication.middleware";

const Router = express.Router();
const orderController = new OrderController();

Router.post("/", authentification, orderController.store.bind(orderController));
Router.get("/", authentification, orderController.index.bind(orderController));
Router.get("/all", orderController.all.bind(orderController));
Router.get("/:id", orderController.show.bind(orderController));
Router.put("/:id", orderController.update.bind(orderController));

export { Router as orderRouter };