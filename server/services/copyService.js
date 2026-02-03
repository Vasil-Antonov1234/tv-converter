import fsPromises from "fs/promises";
import path from "path";
import paths from "../paths/paths.js";
import { handleAgroZlatnoIssue } from "../utils/handleAgroZlatnoIssue.js";

export default {
    async copyIssue(issue, application, applicationIssue) {
        const notCopiedFiles = [];
        let report = "Done";

        let dirFilesSource = "";
        let dirPhotosSource = "";
        let dirTelSite = "";

        const photoIssue = handleAgroZlatnoIssue(applicationIssue);

        // console.log(photoIssue)
        // console.log(typeof(photoIssue))

        if (application === "currentIssue") {
            dirFilesSource = await fsPromises.readdir(paths.readyFiles);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}Telegraph_OLD/`);
            dirTelSite = await fsPromises.readdir(paths.telSite);
        };

        if (application === "Weekend") {
            dirFilesSource = await fsPromises.readdir(paths.weekendFiles);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}_WEEKEND${applicationIssue}/OLD/`);
            dirTelSite = await fsPromises.readdir(paths.telSite);
        };

        if (application === "ZlatnoVreme") {
            dirFilesSource = await fsPromises.readdir(`${paths.zlatno}${applicationIssue}/`);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}_ZLATNO_VREME${photoIssue}/OLD/`);
            dirTelSite = await fsPromises.readdir(paths.zlatnoOutput);
        };

        if (application === "Agro") {
            dirFilesSource = await fsPromises.readdir(`${paths.agro}${applicationIssue}/old/`);
            dirPhotosSource = await fsPromises.readdir(`${paths.photos}_AGRO${photoIssue}/OLD/`);
            dirTelSite = await fsPromises.readdir(paths.agroOutput);
        };

        const dirFiles = dirFilesSource.filter((x) =>
            x.endsWith(".txt") ||
            x.endsWith(".doc") ||
            x.endsWith(".odt") ||
            x.endsWith(".docx")
        );

        const dirPhotos = dirPhotosSource.filter((x) =>
            x.endsWith(".jpg") ||
            x.endsWith(".jpeg") ||
            x.endsWith(".bmp") ||
            x.endsWith(".png") ||
            x.endsWith(".gif") ||
            x.endsWith(".webp")
        );

        const isPaperOrWeekend = application === "currentIssue" || application === "Weekend";

        if (isPaperOrWeekend && !dirTelSite.includes(issue)) {
            await fsPromises.mkdir(`${paths.telSite}/${issue}`);
        };

        if (application === "Agro" && !dirTelSite.includes(applicationIssue)) {
            await fsPromises.mkdir(`${paths.agroOutput}${applicationIssue}`);
        };

        if (application === "ZlatnoVreme" && !dirTelSite.includes(applicationIssue)) {
            await fsPromises.mkdir(`${paths.zlatnoOutput}${applicationIssue}`);
        };

        let outputDirFiles = "";

        if (isPaperOrWeekend) {
            outputDirFiles = await fsPromises.readdir(`${paths.telSite}${issue}`);
        }

        if (application === "Agro") {
            outputDirFiles = await fsPromises.readdir(`${paths.agroOutput}${applicationIssue}`);
        };

        if (application === "ZlatnoVreme") {
            outputDirFiles = await fsPromises.readdir(`${paths.zlatnoOutput}${applicationIssue}`);
        };

        if (isPaperOrWeekend && !outputDirFiles.includes("JPG")) {
            await fsPromises.mkdir(`${paths.telSite}${issue}/JPG`);
        };

        if (application === "Agro" && !outputDirFiles.includes("JPG")) {
            await fsPromises.mkdir(`${paths.agroOutput}${applicationIssue}/JPG`);
        };

        if (application === "ZlatnoVreme" && !outputDirFiles.includes("JPG")) {
            await fsPromises.mkdir(`${paths.zlatnoOutput}${applicationIssue}/JPG`);
        };

        const currentIssue = isPaperOrWeekend ? await fsPromises.readdir(`${paths.pages}${issue}`) : null;

        if (currentIssue && !currentIssue.includes("DOC")) {
            await fsPromises.mkdir(`${paths.pages}${issue}/DOC`);
        };

        let outputDirPhotos = null;

        if (isPaperOrWeekend) {
            outputDirPhotos = await fsPromises.readdir(`${paths.telSite}${issue}/JPG`)
        };

        if (application === "Agro") {
            outputDirPhotos = await fsPromises.readdir(`${paths.agroOutput}${applicationIssue}/JPG`);
        };

        if (application === "ZlatnoVreme") {
            outputDirPhotos = await fsPromises.readdir(`${paths.zlatnoOutput}${applicationIssue}/JPG`);
        };

        try {

            await Promise.all(dirFiles.map(async (file) => {

                let source = null;
                let destination = null;

                if (isPaperOrWeekend) {
                    destination = path.join(`${paths.telSite}${issue}/`, file);
                };

                if (application === "Weekend") {
                    source = path.join(paths.weekendFiles, file);
                };

                if (application === "currentIssue") {
                    source = path.join(paths.readyFiles, file);
                };

                if (application === "Agro") {
                    destination = path.join(`${paths.agroOutput}${applicationIssue}/`, file);
                    source = path.join(`${paths.agro}${applicationIssue}/old/`, file);
                };

                if (application === "ZlatnoVreme") {
                    destination = path.join(`${paths.zlatnoOutput}${applicationIssue}/`, file);
                    source = path.join(`${paths.zlatno}${applicationIssue}/`, file);
                };

                if (outputDirFiles.includes(file)) {
                    notCopiedFiles.push(file);
                } else {
                    await fsPromises.copyFile(source, destination);
                }

                if (isPaperOrWeekend) {
                    await fsPromises.copyFile(source, `${paths.pages}${issue}/DOC/${file}`);
                }
            }))

            await Promise.all(dirPhotos.map(async (photo) => {

                if (outputDirPhotos.includes(photo)) {
                    notCopiedFiles.push(photo);
                } else {
                    let source = null;
                    let destination = null;

                    if (isPaperOrWeekend) {
                        destination = path.join(`${paths.telSite}${issue}/JPG/`, photo);
                    };

                    if (application === "Weekend") {
                        source = path.join(`${paths.photos}_WEEKEND${applicationIssue}/OLD/`, photo);
                    };

                    if (application === "currentIssue") {
                        source = path.join(`${paths.photos}Telegraph_OLD/`, photo);
                    };

                    if (application === "Agro") {
                        destination = path.join(`${paths.agroOutput}${applicationIssue}/JPG/`, photo);
                        source = path.join(`${paths.photos}_AGRO${photoIssue}/OLD/`, photo);
                    };

                    if (application === "ZlatnoVreme") {
                        destination = path.join(`${paths.zlatnoOutput}${applicationIssue}/JPG/`, photo);
                        source = path.join(`${paths.photos}_ZLATNO_VREME${photoIssue}/OLD/`, photo);
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
