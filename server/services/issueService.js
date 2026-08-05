import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import { handleAgroZlatnoIssue } from "../utils/handleAgroZlatnoIssue.js";
import { pathsHandler } from "../utils/pathFilesHandler.js";
import { copyFilesHandler } from "../utils/copyFilesHandler.js";

export default {
    async copy(
        applicationType,
        currentIssueOrAppNumber,
        photoOldNumber,
        applicationFolderName,
        copyAllFiles
    ) {

        const pathsFiles = pathsHandler(applicationType, currentIssueOrAppNumber, photoOldNumber, applicationFolderName);

        const isCopyPFDs = (applicationType !== "currentIssue" && applicationType !== "Weekend");

        try {
            await copyFilesHandler.createFolders(
                currentIssueOrAppNumber,
                applicationType,
                pathsFiles.web,
                photoOldNumber,
                isCopyPFDs,
                applicationFolderName
            );

            const report = await copyFilesHandler.copyFiles(
                currentIssueOrAppNumber,
                applicationType,
                pathsFiles.ready,
                pathsFiles.photoOld,
                pathsFiles.web,
                isCopyPFDs,
                copyAllFiles,
                applicationFolderName
            );

            return report;
        } catch (error) {
            errorLocationMapper(error, "issueService.copy");
            throw error;
        };
    }
}