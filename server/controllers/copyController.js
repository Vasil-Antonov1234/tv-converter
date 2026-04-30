import { Router } from "express";
import copyService from "../services/copyService.js";
import { errorMessageHandler } from "../utils/errorMessageHandler.js";

const copyController = Router();

copyController.post("/issue", async (req, res) => {

    const issue = req.body.issue;
    const application = req.body.application;
    const applicationIssue = req.body.applicationIssue;

    const issueNumber = issue ? issue : applicationIssue;
    
    try {
        const result = await copyService.copyIssue(issue, application, applicationIssue, issueNumber);
        res.status(200);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.status(400);
        res.send(JSON.stringify(errorMessageHandler(error)));
    };

});

export default copyController;
