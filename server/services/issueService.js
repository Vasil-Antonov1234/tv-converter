import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import { handleAgroZlatnoIssue } from "../utils/handleAgroZlatnoIssue.js";
import { pathsHandler } from "../utils/pathFilesHandler.js";
import { copyFilesHandler } from "../utils/copyFilesHandler.js";

export default {
    async copy(application, applicationIssue, issue, copyAllFiles) {
        const extractedApplicationIssue = handleAgroZlatnoIssue(applicationIssue);

        const pathsFiles = pathsHandler(application, issue, extractedApplicationIssue, applicationIssue);

        const isCopyPFDs = (application !== "currentIssue" && application !== "Weekend") && issue;

        try {
            await copyFilesHandler.createFolders(issue, application, pathsFiles.web, applicationIssue, isCopyPFDs);

            const report = await copyFilesHandler.copyFiles(
                issue,
                application,
                pathsFiles.ready,
                pathsFiles.photoOld,
                pathsFiles.web,
                extractedApplicationIssue,
                isCopyPFDs,
                copyAllFiles
            );

            return report;
        } catch (error) {
            errorLocationMapper(error, "issueService.copy");
            throw error;
        };
    }
}