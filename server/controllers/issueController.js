import { Router } from "express";
import { errorLocationMapper, errorMessageHandler } from "../utils/errorMessageHandler.js";
import issueService from "../services/issueService.js";

const issueController = Router();

issueController.post("/copy", async (req, res) => {
    const {
        applicationType,
        currentIssueOrAppNumber,
        photoOldNumber,
        applicationFolderName,
        copyAllFiles
    } = req.body;

    try {
        const result = await issueService.copy(
            applicationType,
            currentIssueOrAppNumber,
            photoOldNumber,
            applicationFolderName,
            copyAllFiles
        );
        res.status(200).json(result);
    } catch (error) {
        errorLocationMapper(error, "issueController.post('/copy')")
        res.status(400).json(errorMessageHandler(error));
    };
});

export default issueController;
