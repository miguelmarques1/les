import * as express from "express";
import { adminAuthorization } from "../middlewares/admin-authorization.middleware";
import { AdminController } from "../controllers/admin.controller";

const Router = express.Router();
const adminController = new AdminController();

Router.post("/auth", adminController.authenticate.bind(adminController));

Router.get("/dashboard", adminAuthorization, adminController.dashboard.bind(adminController));

Router.post("/coupons", adminAuthorization, adminController.createCoupon.bind(adminController));
Router.get("/coupons", adminAuthorization, adminController.listCoupons.bind(adminController));
Router.put("/coupons/:couponId/status", adminAuthorization, adminController.toggleCouponStatus.bind(adminController));

Router.post("/brands", adminAuthorization, adminController.createBrand.bind(adminController));
Router.get("/brands", adminAuthorization, adminController.listBrands.bind(adminController));
Router.delete("/brands/:brandId", adminAuthorization, adminController.deleteBrand.bind(adminController));

Router.get("/orders", adminAuthorization, adminController.listOrders.bind(adminController));
Router.get("/orders/:orderId", adminAuthorization, adminController.getOrderDetails.bind(adminController));

Router.get("/users", adminAuthorization, adminController.listUsers.bind(adminController));

Router.get("/returns", adminAuthorization, adminController.listReturns.bind(adminController));
Router.put("/returns/:returnId/status", adminAuthorization, adminController.updateReturnStatus.bind(adminController));

export { Router as adminRouter };
