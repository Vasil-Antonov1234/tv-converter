import fs from "node:fs";
import fsPromises from "node:fs/promises";
import paths from "../paths/paths.js";
import fileExtensionHandler from "../utils/fileExtensionHandler.js";
import renameRepository from "../repositories/tvRepository.js";
import tvRepository from "../repositories/tvRepository.js";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";

const inputFilePath = paths.input;
const regex = /-\d\d.txt$|-\d\d.docx$/

export default {
    async renameAllTv() {

        try {
            const dir = await fsPromises.readdir(inputFilePath);

            const onlyDocx = dir.filter((tv) => tv.endsWith(".docx"))

            let renamedTvCount = await tvRepository.renameDocx(onlyDocx);

            if (dir.find((x) => x.includes("-") && !x.endsWith("zip"))) {

                for (let el of dir) {

                    const match = el.match(regex);

                    if (!match || (!el.endsWith(".txt") && !el.endsWith(".docx"))) {
                        continue;
                    };

                    const fileExtension = fileExtensionHandler(el);

                    renamedTvCount++;

                    let fileName = el.replace(regex, fileExtension);

                    await fsPromises.rename(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`);
                };
            };

            await tvRepository.encodeMany();

            const diziState = await renameRepository.translateTV();

            return { renamedTvCount, diziState };
        } catch (error) {
            errorLocationMapper(error, "renameService.renameAllTv");
            throw error;
        }
    },

    renameFiles(path, find, changeTo, extension) {

        try {
            let dir = fs.readdirSync(path);
            let result = 0;

            if (extension) {
                dir = dir.filter((file) => file.endsWith(`.${extension}`));
            };

            for (let file of dir) {

                if (file.includes(find)) {
                    const newFileName = file.replace(find, changeTo);

                    fs.renameSync(`${path}/${file}`, `${path}/${newFileName}`);

                    result++
                }
            }

            return result;


        } catch (error) {
            errorLocationMapper(error, "renameService.renameFiles");
            throw error;
        }

    },

    async renamePDF(path, number) {
        let renamedFilesCount = 0;
        const newNumber = number.split("").slice(0, number.length - 2).join("");

        try {
            const dir = (await fsPromises.readdir(path)).filter((x) => x.endsWith(".pdf"))

            await Promise.all(dir.map(async (x) => {
                let newName = x.slice(-6);
                newName = newNumber + newName;

                await fsPromises.rename(`${path}/${x}`, `${path}/${newName}`);
                renamedFilesCount++;
            }));

            return `${renamedFilesCount} files have been renamed`
        } catch (error) {

            errorLocationMapper(error, "renameService.renamePDF");
            throw error;
        };

    }
}
