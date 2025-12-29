import fsPromises from "fs/promises";
import path from "path";
import paths from "../paths/paths.js";

export default {
    async copyIssue(issue, application, applicationIssue) {
        const notCopiedFiles = [];
        let report = "Done";

        let dirFilesSource = "";
        let dirPhotosSource = "";

        if (!applicationIssue) {
            dirFilesSource = await fsPromises.readdir(paths.readyFiles);
            dirPhotosSource = await fsPromises.readdir(paths.photos);
        };

        if (application === "Weekend") {
            dirFilesSource = await fsPromises.readdir(paths.weekendFiles);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}WEEKEND${applicationIssue}/OLD`);
        };

        if (application === "ZlatnoVreme" && applicationIssue) {
            return "Zlatno";
        };

        if (application === "Agro" && application) {
            return "Agro";
        };

        const dirTelSite = await fsPromises.readdir(paths.telSite);

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
            await fsPromises.mkdir(`${paths.telSite}/${issue}`, { recursive: true });
        }

        const outputDirFiles = await fsPromises.readdir(`${paths.telSite}/${issue}`);

        if (!outputDirFiles.includes("JPG")) {
            await fsPromises.mkdir(`${paths.telSite}/${issue}/JPG`);
        };

        const otputDirPhotos = await fsPromises.readdir(`${paths.telSite}/${issue}/JPG`)


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
            throw (error.message);
        };
    }
};