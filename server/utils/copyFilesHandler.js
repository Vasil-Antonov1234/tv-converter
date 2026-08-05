import fsPromises from "fs/promises";
import paths from "../paths/paths.js";
import path from "path";
import { nedelnikIssueHandler } from "./nedelnikIssueHandler.js";
import fileRepository from "../repositories/fileRepository.js";

export const copyFilesHandler = {
    async createFolders(
        currentIssueOrAppNumber,
        applicationType,
        web,
        photoOldNumber,
        isCopyPFDs,
        applicationFolderName
    ) {

        let outputFolderName = "";

        switch (applicationType) {
            case "Nedelnik":
                outputFolderName = nedelnikIssueHandler();
                break;
            case "Agro":
                outputFolderName = `брой ${currentIssueOrAppNumber}`;
                break;
            default: outputFolderName = applicationFolderName;
        };

        try {
            const output = await fileRepository.readDirectoryContent(web);

            if (!output.includes(outputFolderName)) {
                await fileRepository.makeDirectory(`${web}${outputFolderName}`);
            };


            const createdFolder = await fileRepository.readDirectoryContent(`${web}${outputFolderName}`);

            if (!createdFolder.includes("JPG")) {
                await fileRepository.makeDirectory(`${web}${outputFolderName}/JPG`);
            }


            let currentIssue = null;

            if (applicationType === "currentIssue" || applicationType === "Weekend") {
                currentIssue = await fileRepository.readDirectoryContent(`${paths.pages}${outputFolderName}`);
            };

            if (currentIssue && !currentIssue.includes("DOC")) {
                await fileRepository.makeDirectory(`${paths.pages}${outputFolderName}/DOC`);
            };

            if (isCopyPFDs && !currentIssue && !createdFolder.includes("PDF")) {
                await fileRepository.makeDirectory(`${web}${outputFolderName}/PDF`);
            };

        } catch (error) {
            throw new Error(`ERROR(Cannot create folders - copyFilesHandler.createFolders): \n${error.message})`);
        };

    },

    async copyFiles(
        currentIssueOrAppNumber,
        applicationType,
        sourceFolder,
        pathInputFotos,
        pathOutputFiles,
        isCopyPFDs,
        copyAllFiles,
        applicationFolderName
    ) {
        let existingFiles = [];
        let copiedFilesCount = 0;
        let report = "undefined";

        let issueNumber = currentIssueOrAppNumber;

        if (applicationType === "ZlatnoVreme") {
            issueNumber = applicationFolderName;
        };

        let dirReady = "";
        let dirPhotoOld = "";
        let dirPDF = "";

        try {

            dirReady = await fileRepository.readDirectoryContent(sourceFolder);
            dirPhotoOld = await fileRepository.readDirectoryContent(pathInputFotos);
            let pdfFolderName = "";

            if (isCopyPFDs) {

                let check = "";

                if (applicationType === "Nedelnik") {
                    check = await fileRepository.readDirectoryContent(`${paths.pages}${currentIssueOrAppNumber}/Неделник`);
                } else {
                    check = await fileRepository.readDirectoryContent(`${paths.pages}${currentIssueOrAppNumber}`);
                }

                if (check.includes("FTP") || check.includes("ftp")) {
                    pdfFolderName = "FTP";
                };

                if (check.includes("PDF") || check.includes("pdf")) {
                    pdfFolderName = "PDF";
                };

                if (applicationType === "Nedelnik") {
                    dirPDF = await fileRepository.readDirectoryContent(`${paths.pages}${currentIssueOrAppNumber}/Неделник/${pdfFolderName}`);
                } else {
                    dirPDF = await fileRepository.readDirectoryContent(`${paths.pages}${currentIssueOrAppNumber}/${pdfFolderName}`);
                }

            }

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

            if (!copyAllFiles) {

                if (applicationType === "Weekend") {
                    dirFiles = dirFiles.filter((x) => x.toLowerCase().startsWith("w"));
                    dirPhotos = dirPhotos.filter((x) => x.toLowerCase().startsWith("w"));
                }

                if (applicationType === "currentIssue") {
                    const baseDate = new Date();
                    const day = baseDate.getDay();

                    if (day !== 7) {
                        dirFiles = dirFiles.filter((x) => x.startsWith(`8${day + 1}`));
                        dirPhotos = dirPhotos.filter((x) => x.startsWith(`8${day + 1}`));
                    }

                    if (day === 7) {
                        dirFiles = dirFiles.filter((x) => x.startsWith("81"));
                        dirPhotos = dirPhotos.filter((x) => x.startsWith("81"));
                    }
                }
            };

            let dirFilteredPDFs = [];

            if (isCopyPFDs) {
                dirFilteredPDFs = filterPDFs(dirPDF, applicationType);
            }

            let outputDirPhotos = "";

            if (applicationType === "Nedelnik") {
                issueNumber = nedelnikIssueHandler();
                outputDirPhotos = await fileRepository.readDirectoryContent(`${pathOutputFiles}${issueNumber}/JPG`);
            } else {
                outputDirPhotos = await fileRepository.readDirectoryContent(`${pathOutputFiles}${issueNumber}/JPG`);
            }

            let destinationFolder = `${pathOutputFiles}${applicationFolderName}`;

            // switch (applicationType) {
            //     case "currentIssue" || "ZlatnoVreme":
            //         destinationFolder = `${pathOutputFiles}${applicationFolderName}`;
            //         break;
            //     case "Weekend":
            //         destinationFolder = `${pathOutputFiles}${applicationFolderName}`;
            //     break;
            // };

            const isCopyText = true;

            // Copy text files
            let result = await fileRepository.copyMany(
                dirFiles,
                sourceFolder,
                destinationFolder,
                copiedFilesCount,
                existingFiles,
                applicationType,
                applicationFolderName,
                isCopyText
            );

            copiedFilesCount = result.copyedFilesCound;

            // Copy iamges
            destinationFolder = `${destinationFolder}/JPG`;

            result = await fileRepository.copyMany(
                dirPhotos,
                pathInputFotos,
                destinationFolder,
                copiedFilesCount,
                existingFiles,
                applicationType,
                applicationFolderName
            );

            copiedFilesCount = result.copyedFilesCound;

            // Copy PDF files
            if (isCopyPFDs) {
                destinationFolder = `${pathOutputFiles}${issueNumber}/PDF`;

                let sourceFolder = `${paths.pages}${currentIssueOrAppNumber}/${pdfFolderName}`;

                if (applicationType === "Nedelnik") {
                    sourceFolder = `${paths.pages}${currentIssueOrAppNumber}/Неделник/${pdfFolderName}`;
                };

                result = await fileRepository.copyMany(
                    dirFilteredPDFs,
                    sourceFolder,
                    destinationFolder,
                    copiedFilesCount,
                    existingFiles,
                    applicationType,
                    applicationFolderName
                );

                copiedFilesCount = result.copyedFilesCound;
            };

            report = `${copiedFilesCount} files have been copied!`;

            if (existingFiles.length === 1) {
                report = `${existingFiles.join(",")} already exists!`
            }

            if (existingFiles.length > 1) {
                report = `${existingFiles.join(", ")} already exist!`
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

    if (application === "Nedelnik") {
        dirFilteredPDFs = dirPDF.filter((x) => !x.endsWith("000.pdf"));
    };

    return dirFilteredPDFs;
}
