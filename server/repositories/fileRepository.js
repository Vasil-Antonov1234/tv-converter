import fsPromises from "fs/promises";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import paths from "../paths/paths.js";
import path from "path";

export default {
    async readDirectoryContent(path) {
        try {
            return await fsPromises.readdir(path);
        } catch (error) {
            errorLocationMapper(error, "fileRepository.readDirectoryContent");
            throw error;
        };
    },

    async rename(oldPath, newPath) {
        try {
            await fsPromises.rename(oldPath, newPath);
        } catch (error) {
            errorLocationMapper(error, "fileRepository.rename");
            throw error;
        };
    },

    async makeDirectory(path) {
        try {
            await fsPromises.mkdir(path);
        } catch (error) {
            errorLocationMapper(error, "fileRepository.makeDirectory");
            throw error;
        };
    },

    async copy(source, destination) {
        try {
            await fsPromises.copyFile(source, destination);
        } catch (error) {
            errorLocationMapper(error, "fileRepository.copy");
            throw error;
        }
    },

    async copyMany(
        arr,
        sourceFolder,
        destinationFolder,
        copyedFilesCound,
        existingFiles,
        applicationType,
        applicationFolderName,
        isCopyText
    ) {
        const destinationFolderContent = await fsPromises.readdir(destinationFolder);

        await Promise.all(arr.map(async (x) => {
            const source = path.join(sourceFolder, x);
            const destination = path.join(destinationFolder, x);

            if (destinationFolderContent.includes(x)) {
                existingFiles.push(x);
            } else {
                await fsPromises.copyFile(source, destination);
                copyedFilesCound++;
            };

            if (isCopyText && (applicationType === "currentIssue" || applicationType === "Weekend")) {
                await fsPromises.copyFile(source, `${paths.pages}${applicationFolderName}/DOC/${x}`);
            };
        }));

        return { copyedFilesCound, existingFiles };
    }
}