import fileRepository from "../repositories/fileRepository.js";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";

export default {
    async renameManyFiles(path, find, changeTo, extension) {

        try {
            let dir = await fileRepository.readDirectoryContent(path);
            let result = 0;

            if (extension) {
                dir = dir.filter((file) => file.endsWith(`.${extension}`));
            };

            for (let file of dir) {

                if (file.includes(find) && file.includes(".")) {
                    const newFileName = file.replace(find, changeTo);

                    await fileRepository.rename(`${path}/${file}`, `${path}/${newFileName}`);

                    result++
                };
            };

            return result;


        } catch (error) {
            errorLocationMapper(error, "utilService.renameManyFiles");
            throw error;
        }
    }
}