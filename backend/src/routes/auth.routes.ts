import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { AuthController } from "../controllers/auth.controller";

const Router = express.Router();
const authController = new AuthController();

Router.post("/login", authController.login.bind(authController));

export { Router as authRouter };