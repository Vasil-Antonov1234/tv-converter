import { Router } from "express";
import renameServices from "../services/renameServices.js";

const renameController = Router();

renameController.get("/tv", (req, res) => {

    const response = renameServices.renameAllTv();
    res.send(JSON.stringify(`${response} files has been renamed!`));
});

export default renameController;