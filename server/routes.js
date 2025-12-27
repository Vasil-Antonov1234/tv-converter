import { Router } from "express";
import renameController from "./controllers/renameController.js"
import addController from "./controllers/addController.js";
import copyController from "./controllers/copyController.js";

const routes = Router();

routes.use("/rename", renameController);
routes.use("/tv/add", addController);
routes.use("/copy", copyController);

export default routes;
