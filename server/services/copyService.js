import fsPromises from "fs/promises";
import path from "path";
import paths from "../paths/paths.js";

export default {
    async copyIssue(issue) {
        const notCopiedFiles = [];
        let report = "Done";

        const dirFilesSource = await fsPromises.readdir(paths.readyFiles);
        const dirPhotosSource = await fsPromises.readdir(paths.photos);
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
                    const source = path.join(paths.readyFiles, file);
                    const destination = path.join(`${paths.telSite}/${issue}`, file);

                    await fsPromises.copyFile(source, destination);
                }
            }))

            await Promise.all(dirPhotos.map(async (photo) => {

                if (otputDirPhotos.includes(photo)) {
                    notCopiedFiles.push(photo);
                } else {
                    const source = path.join(paths.photos, photo);
                    const destination = path.join(`${paths.telSite}/${issue}/JPG`, photo);

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