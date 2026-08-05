import fsPromises from "fs/promises";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import paths from "../paths/paths.js";

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

    async copyMany(arr, source, destination, copyedFilesCound, existingFiles, applicationType, issueNumber) {
        await Promise.all(arr.map(async (x) => {
            if(destination.includes(x)) {
                existingFiles.push(x);
            } else {
                await fsPromises.copyFile(source, destination);
                copyedFilesCound++;
            };

            if (applicationType === "currentIssue" || applicationType === "Weekend") {
                await fsPromises.copyFile(source, `${paths.pages}${issueNumber}/DOC/${x}`);
                copyedFilesCound++
            };
        }));

        return { copyedFilesCound, existingFiles };
    }
}