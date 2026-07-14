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
    const datesForTvCreation = req.body;

    
    try {

        datesForTvCreation.forEach(async (x) => {
            const day = x.split(" ")[0];
            const date = x.split(" ")[1];

            await tvService.createTv(day, date);
        });

        
        res.status(200).send(JSON.stringify("Success"));
    } catch (error) {
        errorLocationMapper(error, "addController.post('/createAll')");
        res.send(JSON.stringify(errorMessageHandler(error)));
    };
})

export default addController;
