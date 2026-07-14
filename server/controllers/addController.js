import { Router } from "express";
import tvService from "../services/tvService.js";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";

const addController = Router();

addController.post("/", async (req, res) => {

    const day = req.body.day;
    const date = req.body.date;
    
    try {
        const response = await tvService.createTv(day, date);

        res.status(201).send(JSON.stringify(response));
    } catch (error) {
        errorLocationMapper(error, "addController.post('/')")
        res.send(JSON.stringify(errorMessageHandler(error)));
    };
});

addController.post("/createAll", async (req, res) => {
    const body = req.body;

    
})

export default addController;
