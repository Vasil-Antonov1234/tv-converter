import fsPromises from "fs/promises";
import paths from "../paths/paths.js";
import path from "path";

export const copyFilesHandler = {
    async createFolders(issue, application, pathOutputFiles, applicationIssue) {

        let issueNumber = issue;

        if (application !== "currentIssue" && application !== "Weekend") {
            issueNumber = applicationIssue;
        };

        try {
            const output = await fsPromises.readdir(pathOutputFiles);

            if (!output.includes(issueNumber)) {
                await fsPromises.mkdir(`${pathOutputFiles}${issueNumber}`);
            };


            const outputDirFiles = await fsPromises.readdir(`${pathOutputFiles}${issueNumber}`);

            if (!outputDirFiles.includes("JPG")) {
                await fsPromises.mkdir(`${pathOutputFiles}${issueNumber}/JPG`);
            }


            let currentIssue = null;

            if (application === "currentIssue" || application === "Weekend") {
                currentIssue = await fsPromises.readdir(`${paths.pages}${issueNumber}`);
            };

            if (currentIssue && !currentIssue.includes("DOC")) {
                await fsPromises.mkdir(`${paths.pages}${issueNumber}/DOC`);
            };

            if (!currentIssue && !outputDirFiles.includes("PDF")) {
                await fsPromises.mkdir(`${pathOutputFiles}${issueNumber}/PDF`);
            };

        } catch (error) {
            throw new Error(`ERROR(Cannot create folders - copyFilesHandler.createFolders): \n${error.message})`);
        };

    },
    async copyFiles(issue, application, pathInputFiles, pathInputFotos, pathOutputFiles, extractedApplicationIssue, applicationIssue) {
        const notCopiedFiles = [];
        let report = "Done";

        let issueNumber = issue;

        if (application !== "currentIssue" && application !== "Weekend") {
            issueNumber = extractedApplicationIssue;
        };

        let dirReady = "";
        let dirPhotoOld = "";
        // let dirPDF = "";
        // let dirWeb = "";
        // let weekendIssue = "";

        // weekendIssue = issueNumber.includes("-") ? issueNumber.split("-")[0] : issueNumber.split("_")[0];

        try {

            dirReady = await fsPromises.readdir(pathInputFiles);
            dirPhotoOld = await fsPromises.readdir(pathInputFotos);
            // dirPDF = await fsPromises.readdir(`${pathOutputFiles}/PDF`);
            // dirWeb = await fsPromises.readdir(pathOutputFiles);

            const dirFiles = dirReady.filter((x) =>
                x.endsWith(".txt") ||
                x.endsWith(".doc") ||
                x.endsWith(".odt") ||
                x.endsWith(".docx")
            );

            const dirPhotos = dirPhotoOld.filter((x) =>
                x.endsWith(".jpg") ||
                x.endsWith(".JPG") ||
                x.endsWith(".jpeg") ||
                x.endsWith(".bmp") ||
                x.endsWith(".png") ||
                x.endsWith(".gif") ||
                x.endsWith(".webp")
            );

            // const dirFilteredPDFs = filterPDFs(dirPDF);

            let outputDirPhotos = await fsPromises.readdir(`${pathOutputFiles}${applicationIssue}/JPG`);

            await Promise.all(dirFiles.map(async (file) => {
                const source = path.join(pathInputFiles, file);
                const destination = path.join(`${pathOutputFiles}${applicationIssue}`, file);

                if (`${pathOutputFiles}${applicationIssue}`.includes(file)) {
                    notCopiedFiles.push(file);
                } else {
                    await fsPromises.copyFile(source, destination);
                };

                if (application === "currentIssue" || application === "Weekend") {
                    await fsPromises.copyFile(source, `${paths.pages}${issueNumber}/DOC/${file}`);
                };

            }))

            await Promise.all(dirPhotos.map(async (photo) => {
                if (outputDirPhotos.includes(photo)) {
                    notCopiedFiles.push(photo);
                } else {
                    const source = path.join(pathInputFotos, photo);
                    const destination = path.join(`${pathOutputFiles}${applicationIssue}/JPG`, photo);

                    if (`${pathOutputFiles}${applicationIssue}/JPG`.includes(photo)) {
                        notCopiedFiles.push(photo);
                    } else {
                        await fsPromises.copyFile(source, destination);
                    };
                };
            }))

            // await Promise.all(dirFilteredPDFs.map(async (pdf) => {
            //     const source = path.join(`${paths.agro}/FTP`, pdf);
            //     const destination = path.join(`${pathOutputFiles}${issueNumber}/PDF`, pdf);

            //     if (`${pathOutputFiles}${issueNumber}/PDF`.includes(pdf)) {
            //         notCopiedFiles.push(pdf);
            //     } else {
            //         fsPromises.copyFile(source, destination);
            //     }
            // }))

            if (notCopiedFiles.length === 1) {
                report = `${notCopiedFiles.join(",")} already exists!`
            }

            if (notCopiedFiles.length > 1) {
                report = `${notCopiedFiles.join(", ")} already exist!`
            }

            return report;

        } catch (error) {
            throw new Error(`ERROR(Cannot copy file - copyFilesHandler.copyFiles): \n${error.message}`);
        };
    }
}

// function filterPDFs(dirPDF) {

//     const dirFilteredPDFs = [];

//     if (application === "Agro") {

//         dirFilteredPDFs = dirPDF.filter((x) =>
//             x.endsWith("13.pdf") ||
//             x.endsWith("14.pdf") ||
//             x.endsWith("15.pdf") ||
//             x.endsWith("16.pdf") ||
//             x.endsWith("25.pdf") ||
//             x.endsWith("26.pdf") ||
//             x.endsWith("27.pdf") ||
//             x.endsWith("28.pdf")
//         );
//     };

//     return dirFilteredPDFs;
// }
