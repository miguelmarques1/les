import * as express from "express"
import { PrecificationGroupController } from "../controllers/precification-group.controller"
import { adminAuthorization } from "../middlewares/admin-authorization.middleware"

const Router = express.Router()
const precificationGroupController = new PrecificationGroupController()

Router.get("/", adminAuthorization, precificationGroupController.getAll.bind(precificationGroupController))

export { Router as precificationGroupRouter }
