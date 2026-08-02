import { Router } from "express";
import renameServices from "../services/renameServices.js";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";

const utilController = Router();

utilController.post("/rename-many", async (req, res) => {
    const { path, find, changeTo, extension } = req.body;

    try {
        const response = await renameServices.renameFiles(path, find, changeTo, extension);
        res.status(200).json(`${response} files has been renamed!`);
    } catch (error) {
        errorLocationMapper(error, "addonController.post('/rename-many')")
        res.status(400).json(errorMessageHandler(error));
    };
});

export default utilController;