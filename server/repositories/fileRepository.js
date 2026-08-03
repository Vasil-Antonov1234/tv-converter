import fsPromises from "fs/promises";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";

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
    }
}