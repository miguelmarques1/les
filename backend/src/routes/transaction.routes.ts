import * as express from "express";
import { TransactionController } from "../controllers/transaction.controller";

const Router = express.Router();
const transactionController = new TransactionController();

Router.put('/', transactionController.update.bind(transactionController));

export { Router as transactionRouter };