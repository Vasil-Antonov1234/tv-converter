import { Router } from "express";
import renameServices from "../services/renameServices.js";

const renameController = Router();

renameController.get("/tv", (req, res) => {

    try {
        const response = renameServices.renameAllTv();
        res.send(JSON.stringify(`${response} files has been renamed!`));
    } catch (error) {
        res.send(JSON.stringify(error));
    }

});

export default renameController;