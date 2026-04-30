import { handleAgroZlatnoIssue } from "../utils/handleAgroZlatnoIssue.js";
import { pathsHandler } from "../utils/pathFilesHandler.js";
import { copyFilesHandler } from "../utils/copyFilesHandler.js";

export default {
    async copyIssue(application, applicationIssue, issueNumber) {

        const photoIssue = handleAgroZlatnoIssue(applicationIssue);

        const pathsFiles = pathsHandler(application, issueNumber, photoIssue);

        try {
            await copyFilesHandler.createFolders(issueNumber, application, pathsFiles.web);
            const report = await copyFilesHandler.copyFiles(issueNumber, application, pathsFiles.ready, pathsFiles.photoOld, pathsFiles.web);

            return report;
        } catch (error) {
            throw error;
        };
    }
};
