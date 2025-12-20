import { Router } from "express";
import renameController from "./controllers/renameController.js"
import addController from "./controllers/addController.js";

const routes = Router();

routes.use("/tv/rename", renameController);
routes.use("/tv/add", addController)

export default routes;
