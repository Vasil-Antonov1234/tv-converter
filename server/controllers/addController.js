import { Router } from "express";
import tvService from "../services/tvService.js";
import { errorMessageHandler } from "../utils/errorMessageHandler.js";

const addController = Router();

addController.post("/", async (req, res) => {

    const day = req.body.day;
    const date = req.body.date;
    
    try {
        const response = await tvService.createTv(day, date);

        res.status(201);
        res.send(JSON.stringify(response));
    } catch (error) {
        console.log(`Something went wrong! ${errorMessageHandler(error)}.`);
        res.send(JSON.stringify(`Something went wrong! ${errorMessageHandler(error)}.`));
    };
})

export default addController;