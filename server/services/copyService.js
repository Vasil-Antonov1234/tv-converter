import fsPromises from "fs/promises";
import path from "path";
import paths from "../paths/paths.js";

export default {
    async copyIssue(issue, application, applicationIssue) {
        const notCopiedFiles = [];
        let report = "Done";

        let dirFilesSource = "";
        let dirPhotosSource = "";

        if (issue === "currentIssue") {
            try {
                dirFilesSource = await fsPromises.readdir(paths.readyFiles);
                dirPhotosSource = await fsPromises.readdir(paths.photos);
            } catch (error) {
                throw (`Error1: ${error.message}`)
            }            
        };

        if (application === "Weekend" && applicationIssue) {
            try {
                dirFilesSource = await fsPromises.readdir(paths.weekendFiles);
                dirPhotosSource = await fsPromises.readdir(`${paths.photos}WEEKEND${applicationIssue}/OLD`);
            } catch (error) {
                throw (`Error2: ${error.message}`)
            }            
        };

        if (application === "ZlatnoVreme" && applicationIssue) {
            return "Zlatno";
        };

        if (application === "Agro" && applicationIssue) {
            return "Agro";
        };

        let dirTelSite = "";

        try {
            dirTelSite = await fsPromises.readdir(paths.telSite);
        } catch (error) {
            throw (`Error3: ${error.message}`);
        };



        const dirFiles = dirFilesSource.filter((x) => x.endsWith(".txt") ||
            x.endsWith(".doc") ||
            x.endsWith(".odt")
        );

        const dirPhotos = dirPhotosSource.filter((x) => x.endsWith(".jpg") ||
            x.endsWith(".jpeg") ||
            x.endsWith(".bmp") ||
            x.endsWith(".png") ||
            x.endsWith(".gif") ||
            x.endsWith(".webp")
        );

        if (!dirTelSite.includes(issue)) {
            try {
                await fsPromises.mkdir(`${paths.telSite}/${issue}`);
            } catch (error) {
                throw (`Error4: ${error.message}`);
            };

        }

        let outputDirFiles = "";

        try {
            outputDirFiles = await fsPromises.readdir(`${paths.telSite}/${issue}`);
        } catch (error) {
            throw (`Error5: ${error.message}`);
        };

        if (!outputDirFiles.includes("JPG")) {

            try {
                await fsPromises.mkdir(`${paths.telSite}/${issue}/JPG`);
            } catch (error) {
                throw (`Error6: ${error.message}`);
            };

        };

        let otputDirPhotos = "";

        try {
            otputDirPhotos = await fsPromises.readdir(`${paths.telSite}/${issue}/JPG`)
        } catch (error) {
            throw (`Error7: ${error.message}`);
        }

        try {

            await Promise.all(dirFiles.map(async (file) => {

                if (outputDirFiles.includes(file)) {
                    notCopiedFiles.push(file);
                } else {

                    let source = "";
                    const destination = path.join(`${paths.telSite}/${issue}`, file);

                    if (applicationIssue) {
                        source = path.join(paths.weekendFiles, file);
                    }

                    if (!applicationIssue) {
                        source = path.join(paths.readyFiles, file);
                    }

                    await fsPromises.copyFile(source, destination);
                }
            }))

            await Promise.all(dirPhotos.map(async (photo) => {

                if (otputDirPhotos.includes(photo)) {
                    notCopiedFiles.push(photo);
                } else {
                    let source = "";
                    const destination = path.join(`${paths.telSite}/${issue}/JPG`, photo);

                    if (applicationIssue) {
                        source = path.join(`${paths.photos}WEEKEND${applicationIssue}/OLD`, photo);
                    };

                    if (!applicationIssue) {
                        source = path.join(paths.photos, photo);
                    };

                    await fsPromises.copyFile(source, destination);
                }
            }))

            if (notCopiedFiles.length === 1) {
                report = `${notCopiedFiles.join(",")} already exists!`
            }

            if (notCopiedFiles.length > 1) {
                report = `${notCopiedFiles.join(", ")} already exist!`
            }

            return report;

        } catch (error) {
            throw (`Error8: ${error.message}`);
        };
    }
};