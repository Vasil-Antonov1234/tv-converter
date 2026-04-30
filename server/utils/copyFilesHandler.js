import fsPromises from "fs/promises";
import paths from "../paths/paths.js";

export const copyFilesHandler = {
    async createFolders(issueNumber, application, pathInputFiles, pathInputFotos, pathOutputFiles) {
        // const notCopiedFiles = [];
        // let report = "Done";

        // let dirReady = "";
        // let dirPhotoOld = "";
        // let dirWeb = "";
        // let weekendIssue = "";

        // weekendIssue = issueNumber.includes("-") ? issueNumber.split("-")[0] : issueNumber.split("_")[0];

        try {
            // dirReady = await fsPromises.readdir(pathInputFiles);
            // dirPhotoOld = await fsPromises.readdir(pathInputFotos);
            // dirWeb = await fsPromises.readdir(pathOutputFiles);

            // const dirFiles = dirReady.filter((x) =>
            //     x.endsWith(".txt") ||
            //     x.endsWith(".doc") ||
            //     x.endsWith(".odt") ||
            //     x.endsWith(".docx")
            // );

            // const dirPhotos = dirPhotoOld.filter((x) =>
            //     x.endsWith(".jpg") ||
            //     x.endsWith(".JPG") ||
            //     x.endsWith(".jpeg") ||
            //     x.endsWith(".bmp") ||
            //     x.endsWith(".png") ||
            //     x.endsWith(".gif") ||
            //     x.endsWith(".webp")
            // );

            await fsPromises.mkdir(`${pathOutputFiles}${issueNumber}`);

            const outputDirFiles = await fsPromises.readdir(`${pathOutputFiles}${issueNumber}`);

            await fsPromises.mkdir(`${pathOutputFiles}${issueNumber}/JPG`);

            let currentIssue = null;

            if (application === "currentIssue" || application === "Weekend") {
                currentIssue = await fsPromises.readdir(`${paths.pages}${issueNumber}`);
            };

            if (currentIssue && !currentIssue.includes("DOC")) {
                await fsPromises.mkdir(`${paths.pages}${issueNumber}/DOC`);
            };

            if (!currentIssue && !outputDirFiles.includes("PDF")) {
                await fsPromises.mkdir(`${outputDirFiles}${issueNumber}/PDF`);
            };

        } catch (error) {
            throw new Error(`ERROR(Cannot create folders - copyFilesHandler.createFolders): \n${error.message})`);
        };

    }
}

