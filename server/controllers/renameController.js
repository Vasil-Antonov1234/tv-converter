import { Router } from "express";
import renameServices from "../services/renameServices.js";
import { errorMessageHandler } from "../utils/errorMessageHandler.js";
import reportService from "../services/reportService.js";

const renameController = Router();

renameController.post("/tv", async (req, res) => {

    const data = req.body;

    const startDate = data.customStartDate;
    const finalDate = data.customFinalDate;
    try {
        const result = await renameServices.renameAllTv();
        const renamedFilesCount = result.renamedTvCount;
        const response = await reportService.baseReport(renamedFilesCount, startDate, finalDate);

        response.translatedTvState = result.diziState;

        res.send(JSON.stringify(response));
        // res.send(JSON.stringify(`${renamedFilesCount} files has been renamed!`));
    } catch (error) {
        
        res.status(400).send(JSON.stringify(errorMessageHandler(error)));
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
        res.send(JSON.stringify(errorMessageHandler(error)));
    };
});

renameController.post("/pdf", async (req, res) => {
    const path = req.body.path;
    const number = req.body.number;

    try {
        const result = await renameServices.renamePDF(path, number);
        res.status(200);
        res.send(JSON.stringify({ result }));
    } catch (error) {
        res.status(400);
        res.send(JSON.stringify(errorMessageHandler(error)));
    };
})

export default renameController;
