import * as express from "express"
import { BookController } from "../controllers/book.controller"
import { adminAuthorization } from "../middlewares/admin-authorization.middleware"

const Router = express.Router()
const bookController = new BookController()

Router.get("/", bookController.index.bind(bookController))
Router.post("/", adminAuthorization, bookController.store.bind(bookController))
Router.get("/interest/:customerId", bookController.showCustomerInterest.bind(bookController))
Router.get("/category/:categoryId", bookController.booksByCategory.bind(bookController))
Router.get("/:id", bookController.show.bind(bookController))
Router.post("/ids", bookController.booksByIDs.bind(bookController))

export { Router as bookRouter }
