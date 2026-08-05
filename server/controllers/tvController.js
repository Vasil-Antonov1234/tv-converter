import { Router } from "express";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";
import tvService from "../services/tvService.js";

const tvController = Router();

tvController.post("/base-decode-report", async (req, res) => {
    const data = req.body;

    const startDate = data.customStartDate;
    const finalDate = data.customFinalDate;
    try {
        const result = await tvService.renameMany();
        const renamedFilesCount = result.renamedTvCount;
        const response = await tvService.baseReport(renamedFilesCount, startDate, finalDate);

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
});

tvController.post("/create-all", async (req, res) => {
    const datesForTvCreation = req.body;


    try {
        await tvService.createAll(datesForTvCreation);

        res.status(200).json("Ok");
    } catch (error) {
        errorLocationMapper(error, "tvController.post('/create-all')");
        res.status(400).json(errorMessageHandler(error));
    };
});

export default tvController;