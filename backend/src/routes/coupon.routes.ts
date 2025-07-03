import * as express from "express";
import { authentification } from "../middlewares/authentication.middleware";
import { CouponController } from "../controllers/coupon.controller";

const Router = express.Router();
const couponController = new CouponController();

Router.post("/validate", authentification, couponController.validate.bind(couponController));
// Router.post("/", authentification, couponController.store.bind(couponController));


export { Router as couponRouter };