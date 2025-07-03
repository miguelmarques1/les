import * as express from "express";
import { StockController } from "../controllers/stock.controller";
import { authentification } from "../middlewares/authentication.middleware";

const Router = express.Router();
const stockController = new StockController();

Router.get('/', stockController.index.bind(stockController));
Router.get('/:id', stockController.show.bind(stockController));
Router.post('/', stockController.store.bind(stockController));

export { Router as stockRouter };