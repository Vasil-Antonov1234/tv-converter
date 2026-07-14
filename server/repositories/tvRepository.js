import fsPromises from "fs/promises";
import paths from "../paths/paths.js";
import { tvForFix, tvForTranslate } from "../data/tvNames.js";
import { translate } from "../utils/translate.js";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import mammoth from "mammoth";
import jschardet from "jschardet";
import iconv from "iconv-lite";
import { handleFixTv } from "../utils/handleFixTV.js";

export default {
    async translateTV() {

        try {
            const renamedDir = await fsPromises.readdir(paths.input);
            let diziState = "normal";

            for (let tv of renamedDir) {

                if (tvForTranslate.includes(tv)) {
                    let outputDir = paths.input;
                    let outputFile = `${outputDir}${tv}`

                    const date = new Date();
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const cacheFileName = `translated-${day}-${month}-${year}-${tv}`


                    const cacheDir = await fsPromises.readdir(paths.cache);

                    if (cacheDir.includes(cacheFileName)) {
                        diziState = "cached"
                        await fsPromises.copyFile(`${paths.cache}${cacheFileName}`, `${paths.input}${tv}`);
                    } else {

                        const textTv = await fsPromises.readFile(`${paths.input}${tv}`, { encoding: "utf-8" });

                        const result = await translate(textTv);

                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });

                        await fsPromises.writeFile(`${paths.cache}${cacheFileName}`, result, { encoding: "utf-8" });
                    };
                };
            };

            return diziState;
        } catch (error) {
            errorLocationMapper(error, `tvRepository.translateTV: ${error.message}`);
            throw error;
        };
    },

    async renameDocx(onlyDocx) {
        let renamedTvCount = 0;


        for (let tv of onlyDocx) {

            if (!tv.includes("_")) {
                continue;
            }

            let fileName = tv.split("_")[0];
            fileName = `${fileName}.docx`;

            try {
                renamedTvCount++;
                await fsPromises.rename(`${paths.input}${tv}`, `${paths.input}${fileName}`);

            } catch (error) {
                errorLocationMapper(error, `tvRepository.renameDocx: ${error.message}`);
                throw error;
            };
        };

        return renamedTvCount;
    },

    async encodeMany() {

        try {
            let renamedDir = await fsPromises.readdir(paths.input);

            for (let tv of renamedDir) {

                if (tvForFix.includes(tv) || tv.endsWith(".docx")) {

                    const buffer = await fsPromises.readFile(`${paths.input}${tv}`);

                    if (tv.endsWith(".docx")) {
                        const encodedBuffer = await mammoth.extractRawText({ buffer });
                        const encodedTv = encodedBuffer.value;

                        const result = handleFixTv(encodedTv, tv);
                        let outputDir = paths.input;

                        const filename = tv.split(".")[0].toLocaleLowerCase();

                        const outputFile = `${outputDir}${filename}.txt`

                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });
                    }

                    if (tv.endsWith(".txt")) {
                        let encodedTV = "";
                        let charSet = jschardet.detect(buffer).encoding;

                        if (charSet === "x-mac-cyrillic") {
                            charSet = "windows-1251";
                        };

                        if (!charSet) {
                            charSet = "utf-8";
                        };

                        encodedTV = iconv.decode(buffer, charSet);

                        const result = handleFixTv(encodedTV, tv);
                        let outputDir = paths.input;
                        let outputFile = `${outputDir}${tv}`

                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });
                    }
                }
            }
        } catch (error) {
            errorLocationMapper(error, `tvRepository.encodeMany: ${error.message}`);

            throw error;
        };
    }
}
