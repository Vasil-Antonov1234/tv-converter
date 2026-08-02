import { Router } from "express";
import renameServices from "../services/renameServices.js";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";

const addonController = Router();

addonController.post("/rename-many", async (req, res) => {
    const { path, find, changeTo, extension } = req.body;

    try {
        const response = await renameServices.renameFiles(path, find, changeTo, extension);
        res.status(200).send(JSON.stringify(`${response} files has been renamed!`));
    } catch (error) {
        errorLocationMapper(error, "addonController.post('/rename-many')")
        res.status(400).send(JSON.stringify(errorMessageHandler(error)));
    };
});

export default addonController;