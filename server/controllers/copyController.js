import { Router } from "express";
import copyService from "../services/copyService.js";

const copyController = Router();

copyController.post("/issue", async (req, res) => {

    const issue = req.body.issue;

    try {
        const result = await copyService.copyIssue(issue);
        res.status(200);
        res.send(JSON.stringify(result));
    } catch (error) {
        // res.status(406);
        res.send(JSON.stringify(error));
    };

});

export default copyController;