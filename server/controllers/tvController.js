import { Router } from "express";
import renameServices from "../services/renameServices";
import reportService from "../services/reportService";
import { errorMessageHandler } from "../utils/errorMessageHandler";

const tvController = Router();

tvController.post("/base-decode-report", async (req, res) => {
    const data = req.body;

    const startDate = data.customStartDate;
    const finalDate = data.customFinalDate;
    try {
        const result = await renameServices.renameAllTv();
        const renamedFilesCount = result.renamedTvCount;
        const response = await reportService.baseReport(renamedFilesCount, startDate, finalDate);

        response.translatedTvState = result.diziState;

        res.status(200).json(response);
    } catch (error) {
        errorLocationMapper(error, "renameController.post('/tv')");
        res.status(400).json(errorMessageHandler(error));
    };
})

export default tvController;