import { Router } from "express";
import addController from "./controllers/addController.js";
import copyController from "./controllers/copyController.js";
import utilController from "./controllers/utilController.js";
import tvController from "./controllers/tvController.js";

const routes = Router();

// routes.use("/tv/add", addController);
routes.use("/copy", copyController);
routes.use("/utils", utilController);
routes.use("/tv", tvController);

routes.all("/*url", (req, res) => {
    res.status(404);
    res.send(JSON.stringify("Bad request! Wrong url address!"));
})

export default routes;
