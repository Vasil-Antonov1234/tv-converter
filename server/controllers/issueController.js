import { Router } from "express";
import copyService from "../services/copyService.js";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";

const issueController = Router();

issueController.post("/copy", async (req, res) => {
    const issue = req.body.issue;
    const application = req.body.application;
    const applicationIssue = req.body.applicationIssue;
    const copyAllFiles = req.body.copyAllFiles;


    try {
        const result = await copyService.copyIssue(application, applicationIssue, issue, copyAllFiles);
        res.status(200).json(result);
    } catch (error) {
        errorLocationMapper(error, "issueController.post('/copy')")
        res.status(400).json(errorMessageHandler(error));
    };
})

export default issueController;
