import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { CardController } from "../controllers/card.controller";

const Router = express.Router();
const cardController = new CardController();

Router.post("/", authentification, cardController.store.bind(cardController));
// Router.put("/:id", authentification, cardController.update.bind(cardController));
Router.get("/", authentification, cardController.index.bind(cardController));
Router.delete("/:id", authentification, cardController.delete.bind(cardController));

export { Router as cardRouter };
