import fsPromises from "fs/promises";
import paths from "../paths/paths.js";
import path from "path";

export const copyFilesHandler = {
    async createFolders(issue, application, pathOutputFiles, applicationIssue, isCopyPFDs) {

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

            if (isCopyPFDs && !currentIssue && !outputDirFiles.includes("PDF")) {
                await fsPromises.mkdir(`${pathOutputFiles}${issueNumber}/PDF`);
            };

        } catch (error) {
            throw new Error(`ERROR(Cannot create folders - copyFilesHandler.createFolders): \n${error.message})`);
        };

    },
    async copyFiles(issue, application, pathInputFiles, pathInputFotos, pathOutputFiles, extractedApplicationIssue, isCopyPFDs, copyAllFiles) {
        const notCopiedFiles = [];
        let copiedFilesCount = 0;
        let report = "undefined";

        let issueNumber = issue;

        if (application !== "currentIssue" && application !== "Weekend") {
            issueNumber = extractedApplicationIssue;
        };

        let dirReady = "";
        let dirPhotoOld = "";
        let dirPDF = "";
        // let dirWeb = "";
        // let weekendIssue = "";

        // weekendIssue = issueNumber.includes("-") ? issueNumber.split("-")[0] : issueNumber.split("_")[0];

        try {

            dirReady = await fsPromises.readdir(pathInputFiles);
            dirPhotoOld = await fsPromises.readdir(pathInputFotos);

            if (isCopyPFDs) {
                const check = await fsPromises.readdir(`${paths.pages}${issue}`);
                let pdfFolderName = "";

                if (check.includes("FTP") || check.includes("ftp")) {
                    pdfFolderName = "FTP";
                };

                if (check.includes("PDF") || check.includes("pdf")) {
                    pdfFolderName = "PDF";
                };

                dirPDF = await fsPromises.readdir(`${paths.pages}${issue}/${pdfFolderName}`);
            }
            // dirWeb = await fsPromises.readdir(pathOutputFiles);

            let dirFiles = dirReady.filter((x) =>
                x.endsWith(".txt") ||
                x.endsWith(".doc") ||
                x.endsWith(".odt") ||
                x.endsWith(".docx")
            );

            let dirPhotos = dirPhotoOld.filter((x) =>
                x.endsWith(".jpg") ||
                x.endsWith(".JPG") ||
                x.endsWith(".jpeg") ||
                x.endsWith(".bmp") ||
                x.endsWith(".png") ||
                x.endsWith(".gif") ||
                x.endsWith(".webp")
            );

            if (application === "Weekend" && !copyAllFiles) {
                dirFiles = dirFiles.filter((x) => x.toLowerCase().startsWith("w"));
                dirPhotos = dirPhotos.filter((x) => x.toLowerCase().startsWith("w"));
            };
            
            let dirFilteredPDFs = [];

            if (isCopyPFDs) {
                dirFilteredPDFs = filterPDFs(dirPDF, application);
            }


            let outputDirPhotos = await fsPromises.readdir(`${pathOutputFiles}${issueNumber}/JPG`);

            await Promise.all(dirFiles.map(async (file) => {
                const source = path.join(pathInputFiles, file);
                const destination = path.join(`${pathOutputFiles}${issueNumber}`, file);

                if (`${pathOutputFiles}${issueNumber}`.includes(file)) {
                    notCopiedFiles.push(file);
                } else {
                    await fsPromises.copyFile(source, destination);
                    copiedFilesCount++;
                };

                if (application === "currentIssue" || application === "Weekend") {
                    await fsPromises.copyFile(source, `${paths.pages}${issueNumber}/DOC/${file}`);
                    copiedFilesCount++;
                };

            }))

            await Promise.all(dirPhotos.map(async (photo) => {
                if (outputDirPhotos.includes(photo)) {
                    notCopiedFiles.push(photo);
                } else {
                    const source = path.join(pathInputFotos, photo);
                    const destination = path.join(`${pathOutputFiles}${issueNumber}/JPG`, photo);

                    if (`${pathOutputFiles}${issueNumber}/JPG`.includes(photo)) {
                        notCopiedFiles.push(photo);
                    } else {
                        await fsPromises.copyFile(source, destination);
                        copiedFilesCount++;
                    };
                };
            }))

            if (isCopyPFDs) {
                await Promise.all(dirFilteredPDFs.map(async (pdf) => {
                    const source = path.join(`${paths.pages}${issue}/FTP`, pdf);
                    const destination = path.join(`${pathOutputFiles}${issueNumber}/PDF`, pdf);

                    if (`${pathOutputFiles}${issueNumber}/PDF`.includes(pdf)) {
                        notCopiedFiles.push(pdf);
                    } else {
                        fsPromises.copyFile(source, destination);
                        copiedFilesCount++;
                    };
                }));
            }

            report = `${copiedFilesCount} files have been copied!`;

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

function filterPDFs(dirPDF, application) {

    let dirFilteredPDFs = [];

    if (application === "Agro") {

        dirFilteredPDFs = dirPDF.filter((x) =>
            x.endsWith("13.pdf") ||
            x.endsWith("14.pdf") ||
            x.endsWith("15.pdf") ||
            x.endsWith("16.pdf") ||
            x.endsWith("25.pdf") ||
            x.endsWith("26.pdf") ||
            x.endsWith("27.pdf") ||
            x.endsWith("28.pdf")
        );
    };

    if (application === "ZlatnoVreme") {

        dirFilteredPDFs = dirPDF.filter((x) =>
            x.endsWith("11.pdf") ||
            x.endsWith("12.pdf") ||
            x.endsWith("13.pdf") ||
            x.endsWith("14.pdf") ||
            x.endsWith("15.pdf") ||
            x.endsWith("16.pdf") ||
            x.endsWith("25.pdf") ||
            x.endsWith("26.pdf") ||
            x.endsWith("27.pdf") ||
            x.endsWith("28.pdf") ||
            x.endsWith("29.pdf") ||
            x.endsWith("30.pdf")
        );
    };

    if (application === "Viara") {
        dirFilteredPDFs = dirPDF.filter((x) =>
            x.endsWith("13.pdf") ||
            x.endsWith("14.pdf") ||
            x.endsWith("15.pdf") ||
            x.endsWith("16.pdf") ||
            x.endsWith("25.pdf") ||
            x.endsWith("26.pdf") ||
            x.endsWith("27.pdf") ||
            x.endsWith("28.pdf") ||
            x.endsWith("27.pdf")
        );
    };

    if (application === "Zdrave") {
        dirFilteredPDFs = dirPDF.filter((x) =>
            x.endsWith("17.pdf") ||
            x.endsWith("18.pdf") ||
            x.endsWith("19.pdf") ||
            x.endsWith("20.pdf") ||
            x.endsWith("21.pdf") ||
            x.endsWith("22.pdf") ||
            x.endsWith("23.pdf") ||
            x.endsWith("24.pdf")
        );
    };

    return dirFilteredPDFs;
}
