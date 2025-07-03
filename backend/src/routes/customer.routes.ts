import * as express from "express";
import { CustomerController } from "../controllers/customer.controller";
import { authentification } from "../middlewares/authentication.middleware";

const Router = express.Router();
const customerController = new CustomerController();

Router.post("/", customerController.store.bind(customerController));
Router.get("/", authentification, customerController.index.bind(customerController));
Router.put("/", authentification, customerController.update.bind(customerController));

export { Router as customerRouter };