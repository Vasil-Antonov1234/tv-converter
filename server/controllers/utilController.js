import { Router } from "express";
import renameServices from "../services/renameServices.js";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";
import utilService from "../services/utilService.js";

const utilController = Router();

utilController.post("/rename-many", async (req, res) => {
    const { path, find, changeTo, extension } = req.body;

    try {
        const response = await utilService.renameManyFiles(path, find, changeTo, extension);
        res.status(200).json(`${response} files has been renamed!`);
    } catch (error) {
        errorLocationMapper(error, "utilController.post('/rename-many')")
        res.status(400).json(errorMessageHandler(error));
    };
});

utilController.post("/remane-pdf", async (req, res) => {
    const path = req.body.path;
    const number = req.body.number;

    try {
        const result = await renameServices.renamePDF(path, number);
        res.status(200).json({ result });
    } catch (error) {
        errorLocationMapper(error, "utilController.post('/remane-pdf')");
        res.status(400).json(errorMessageHandler(error));
    };
})

export default utilController;