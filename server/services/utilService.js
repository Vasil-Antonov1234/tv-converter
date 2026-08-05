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
    },

    async renamePDFs(path, number) {
        let renamedFilesCount = 0;
        const newNumber = number.split("").slice(0, number.length - 2).join("");

        try {
            const dir = (await fileRepository.readDirectoryContent(path)).filter((x) => x.endsWith(".pdf"))

            await Promise.all(dir.map(async (x) => {
                let newName = x.slice(-6);
                newName = newNumber + newName;

                await fileRepository.rename(`${path}/${x}`, `${path}/${newName}`);
                renamedFilesCount++;
            }));

            return `${renamedFilesCount} files have been renamed`
        } catch (error) {
            errorLocationMapper(error, "renameService.renamePDF");
            throw error;
        };
    }
}