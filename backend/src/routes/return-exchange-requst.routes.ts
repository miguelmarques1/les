import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { ReturnExchangeRequestController } from "../controllers/return-exchange-request.controller";

const Router = express.Router();
const returnExchangeController = new ReturnExchangeRequestController();

Router.post("/", authentification, returnExchangeController.store.bind(returnExchangeController));
Router.put("/:id/status", authentification, returnExchangeController.updateStatus.bind(returnExchangeController));
Router.get("/", authentification, returnExchangeController.findAll.bind(returnExchangeController));
Router.get("/my-requests", authentification, returnExchangeController.findMine.bind(returnExchangeController));

export { Router as returnExchangeRouter };