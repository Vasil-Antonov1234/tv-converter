import { Router } from "express";
import renameServices from "../services/renameServices.js";

const renameController = Router();

renameController.get("/tv", (req, res) => {

    try {
        const response = renameServices.renameAllTv();
        res.send(JSON.stringify(`${response} files has been renamed!`));
    } catch (error) {
        res.send(JSON.stringify(error));
    };

});

renameController.post("/files", (req, res) => {
    const data = req.body;

    const { path, find, changeTo, extension } = data;

    try {
    const response = renameServices.renameFiles(path, find, changeTo, extension);
        res.send(JSON.stringify(`${response} files has been renamed!`));
    } catch (error) {
        res.status(400);
        res.send(JSON.stringify(error));
    };
});

export default renameController;