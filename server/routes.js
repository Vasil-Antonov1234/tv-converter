import { Router } from "express";
import renameController from "./controllers/renameController.js"
import addController from "./controllers/addController.js";
import copyController from "./controllers/copyController.js";
import addonController from "./controllers/addonController.js";

const routes = Router();

routes.use("/rename", renameController);
routes.use("/tv/add", addController);
routes.use("/copy", copyController);
routes.use("/addons", addonController);

routes.all("/*url", (req, res) => {
    res.status(404);
    res.send(JSON.stringify("Bad request! Wrong url address!"));
})

export default routes;
