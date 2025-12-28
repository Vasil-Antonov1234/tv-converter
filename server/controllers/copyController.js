import { Router } from "express";
import copyService from "../services/copyService.js";

const copyController = Router();

copyController.post("/issue", async (req, res) => {

    const issue = req.body.issue;
    const weekend = req.body.weekend;
    
    try {
        const result = await copyService.copyIssue(issue, weekend);
        res.status(200);
        res.send(JSON.stringify(result));
    } catch (error) {
        // res.status(406);
        res.send(JSON.stringify(error));
    };

});

export default copyController;