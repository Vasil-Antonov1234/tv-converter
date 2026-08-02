import { Router } from "express";
import { errorLocationMapper, errorMessageHandler} from "../utils/errorMessageHandler.js";
import reportService from "../services/reportService.js";
import tvService from "../services/tvService.js";
import renameServices from "../services/renameServices.js";

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
        errorLocationMapper(error, "tvController.post('/base-decode-report')");
        res.status(400).json(errorMessageHandler(error));
    };
});

tvController.post("/create-one", async (req, res) => {
    const day = req.body.day;
    const date = req.body.date;

    try {
        const response = await tvService.createTv(day, date);

        res.status(201).json(response)
    } catch (error) {
        errorLocationMapper(error, "tvController.post('/create-one')");
        res.status(400).json(errorMessageHandler(error));
    };
})

export default tvController;