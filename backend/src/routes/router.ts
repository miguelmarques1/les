import * as express from "express";
import { customerRouter } from "./customer.routes";
import { authRouter } from "./auth.routes";
import { addressRouter } from "./address.routes";
import { cardRouter } from "./card.routes";
import { brandRouter } from "./brand.routes";
import { categoryRouter } from "./category.routes";
import { bookRouter } from "./book.routes";
import { stockRouter } from "./stock.routes";
import { cartRouter } from "./cart.routes";
import { couponRouter } from "./coupon.routes";
import { orderRouter } from "./order.routes";
import { returnExchangeRouter } from "./return-exchange-requst.routes";
import { adminRouter } from "./admin.routes";
import { transactionRouter } from "./transaction.routes";
import { recommendationkRouter } from "./recommendation.route";

const Router = express.Router();

Router.use("/customers", customerRouter);
Router.use("/auth", authRouter);
Router.use("/address", addressRouter);
Router.use("/card", cardRouter);
Router.use("/brand", brandRouter);
Router.use("/category", categoryRouter);
Router.use("/book", bookRouter);
Router.use("/stock", stockRouter);
Router.use("/cart", cartRouter);
Router.use("/coupon", couponRouter);
Router.use("/order", orderRouter);
Router.use("/return-exchange-requests", returnExchangeRouter);
Router.use("/admin", adminRouter);
Router.use("/transaction", transactionRouter);
Router.use("/recommendations", recommendationkRouter);

export { Router as router };