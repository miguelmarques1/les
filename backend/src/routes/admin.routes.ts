import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { AdminController } from "../controllers/admin.controller";

const Router = express.Router();
const adminController = new AdminController();

Router.post("/auth", adminController.authenticate.bind(adminController));
Router.get("/dashboard", authentification, adminController.dashboard.bind(adminController));

export { Router as adminRouter };
