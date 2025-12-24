import { Router } from "express";
import tvService from "../services/tvService.js";

const addController = Router();

addController.post("/", async (req, res) => {

    const day = req.body.day;
    const date = req.body.date;
    
    try {
        const response = await tvService.createTv(day, date);

        res.status(201);
        res.send(JSON.stringify(response));
    } catch (error) {
        return alert(error.message);
    };
})

export default addController;