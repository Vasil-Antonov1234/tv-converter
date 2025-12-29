import { Router } from "express";
import copyService from "../services/copyService.js";

const copyController = Router();

copyController.post("/issue", async (req, res) => {

    const issue = req.body.issue;
    const application = req.body.application;
    const applicationIssue = req.body.applicationIssue;
    
    try {
        const result = await copyService.copyIssue(issue, application, applicationIssue);
        res.status(200);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.send(JSON.stringify(`${error} -${error.message}-`));
    };

});

export default copyController;