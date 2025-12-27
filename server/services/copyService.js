import fsPromises from "fs/promises";
import path from "path";
import paths from "../paths/paths.js";

export default {
    async copyIssue(issue) {
        const notCopiedFiles = [];
        let report = "Done";

        const dirSource = await fsPromises.readdir(paths.readyFiles);
        const dirTelSite = await fsPromises.readdir(paths.telSite);

        const dir = dirSource.filter((x) => x.endsWith(".txt") ||
            x.endsWith(".doc") ||
            x.endsWith(".odt")
        );

        if (!dirTelSite.includes(issue)) {
            await fsPromises.mkdir(`${paths.telSite}/${issue}`, { recursive: true });
        }

        const outputDir = await fsPromises.readdir(`${paths.telSite}/${issue}`);


        try {

            await Promise.all(dir.map(async (file) => {

                if (outputDir.includes(file)) {
                    notCopiedFiles.push(file);
                } else {
                    const source = path.join(paths.readyFiles, file);
                    const destination = path.join(`${paths.telSite}/${issue}`, file);

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