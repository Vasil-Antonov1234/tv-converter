import { Router } from "express";
import utilController from "./controllers/utilController.js";
import tvController from "./controllers/tvController.js";
import issueController from "./controllers/issueController.js";

const routes = Router();

routes.use("/tv", tvController);
routes.use("/issue-addons", issueController);
routes.use("/utils", utilController);

routes.all("/*url", (req, res) => {
    res.status(404);
    res.send(JSON.stringify("Bad request! Wrong url address!"));
})

export default routes;
