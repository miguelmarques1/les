import * as express from "express";
import { AddressController } from "../controllers/address.controller";
import { authentification } from "../middlewares/authentication.middleware";

const Router = express.Router();
const addressController = new AddressController();

Router.post("/", authentification, addressController.store.bind(addressController));
Router.get("/", authentification, addressController.index.bind(addressController));
Router.put("/:id", authentification, addressController.update.bind(addressController));
Router.delete("/:id", authentification, addressController.delete.bind(addressController));

export { Router as addressRouter };
