import { handleAgroZlatnoIssue } from "../utils/handleAgroZlatnoIssue.js";
import { pathsHandler } from "../utils/pathFilesHandler.js";
import { copyFilesHandler } from "../utils/copyFilesHandler.js";

export default {
    async copyIssue(application, applicationIssue, issue) {

        const extractedApplicationIssue = handleAgroZlatnoIssue(applicationIssue);

        const pathsFiles = pathsHandler(application, issue, extractedApplicationIssue, applicationIssue);

        try {
            await copyFilesHandler.createFolders(issue, application, pathsFiles.web, applicationIssue);
            const report = await copyFilesHandler.copyFiles(issue, application, pathsFiles.ready, pathsFiles.photoOld, pathsFiles.web, extractedApplicationIssue, applicationIssue);

            return report;
        } catch (error) {
            throw error;
        };
    }
};
