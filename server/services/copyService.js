import fsPromises from "fs/promises";
import path from "path";
import paths from "../paths/paths.js";

export default {
    async copyIssue(issue, application, applicationIssue) {
        const notCopiedFiles = [];
        let report = "Done";

        let dirFilesSource = "";
        let dirPhotosSource = "";

        if (application === "currentIssue") {
            dirFilesSource = await fsPromises.readdir(paths.readyFiles);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}Telegraph_OLD/`);
        };

        if (application === "Weekend") {
            dirFilesSource = await fsPromises.readdir(paths.weekendFiles);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}_WEEKEND${applicationIssue}/OLD/`);
        };

        if (application === "ZlatnoVreme") {
            return "Zlatno";
        };

        if (application === "Agro") {
            dirFilesSource = await fsPromises.readdir(`${paths.agro}${applicationIssue}/old/`);
        };

        const dirTelSite = await fsPromises.readdir(paths.telSite);

        const dirFiles = dirFilesSource.filter((x) =>
            x.endsWith(".txt") ||
            x.endsWith(".doc") ||
            x.endsWith(".odt")
        );

        const dirPhotos = dirPhotosSource.filter((x) =>
            x.endsWith(".jpg") ||
            x.endsWith(".jpeg") ||
            x.endsWith(".bmp") ||
            x.endsWith(".png") ||
            x.endsWith(".gif") ||
            x.endsWith(".webp")
        );

        if (!dirTelSite.includes(issue)) {
            await fsPromises.mkdir(`${paths.telSite}/${issue}`);
        }

        const outputDirFiles = await fsPromises.readdir(`${paths.telSite}/${issue}`);

        if (!outputDirFiles.includes("JPG")) {
            await fsPromises.mkdir(`${paths.telSite}/${issue}/JPG`);
        };

        const currentIssue = await fsPromises.readdir(`${paths.pages}${issue}`)

        if (!currentIssue.includes("DOC")) {
            await fsPromises.mkdir(`${paths.pages}${issue}/DOC`);
        };

        const otputDirPhotos = await fsPromises.readdir(`${paths.telSite}/${issue}/JPG`);

        try {

            await Promise.all(dirFiles.map(async (file) => {

                let source = "";
                const destination = path.join(`${paths.telSite}/${issue}/`, file);

                if (application === "Weekend") {
                    source = path.join(paths.weekendFiles, file);
                }

                if (application === "currentIssue") {
                    source = path.join(paths.readyFiles, file);
                }

                if (outputDirFiles.includes(file)) {
                    notCopiedFiles.push(file);
                } else {
                    await fsPromises.copyFile(source, destination);
                }

                if (application === "currentIssue" || application === "Weekend") {
                    await fsPromises.copyFile(source, `${paths.pages}${issue}/DOC/${file}`);
                }
            }))

            await Promise.all(dirPhotos.map(async (photo) => {

                if (otputDirPhotos.includes(photo)) {
                    notCopiedFiles.push(photo);
                } else {
                    let source = "";
                    const destination = path.join(`${paths.telSite}/${issue}/JPG/`, photo);

                    if (application === "Weekend") {
                        source = path.join(`${paths.photos}_WEEKEND${applicationIssue}/OLD/`, photo);
                    };

                    if (application === "currentIssue") {
                        source = path.join(`${paths.photos}Telegraph_OLD/`, photo);
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
