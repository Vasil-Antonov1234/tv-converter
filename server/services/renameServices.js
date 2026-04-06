import fs from "node:fs";
import fsPromises from "node:fs/promises";
import mammoth from "mammoth";
import paths from "../paths/paths.js";
import iconv from "iconv-lite";
import jschardet from "jschardet";
import { handleFixTv } from "../utils/handleFixTV.js";
import { tvForFix, tvForTranslate } from "../data/tvNames.js";
import fileExtensionHandler from "../utils/fileExtensionHandler.js";
import { translate } from "../utils/translate.js"

const inputFilePath = paths.input;
const regex = /-\d\d.txt$|-\d\d.docx$/

export default {
    async renameAllTv() {

        try {
            // const dir = fs.readdirSync(inputFilePath);
            const dir = await fsPromises.readdir(inputFilePath);
            let renamedTvCount = 0;

            const onlyDocx = dir.filter((tv) => tv.endsWith(".docx"))

            for (let tv of onlyDocx) {

                if (!tv.includes("_")) {
                    continue;
                }

                renamedTvCount++;

                let fileName = tv.split("_")[0];
                fileName = `${fileName}.docx`;

                // fs.renameSync(`${inputFilePath}${tv}`, `${inputFilePath}${fileName}`);
                await fsPromises.rename(`${inputFilePath}${tv}`, `${inputFilePath}${fileName}`);
            }

            if (dir.find((x) => x.includes("-"))) {

                for (let el of dir) {

                    const match = el.match(regex);

                    if (!match || (!el.endsWith(".txt") && !el.endsWith(".docx"))) {
                        continue;
                    };

                    const fileExtension = fileExtensionHandler(el);

                    renamedTvCount++;

                    let fileName = el.replace(regex, fileExtension);

                    // fs.renameSync(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`);
                    await fsPromises.rename(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`);
                };
            };

            // const renamedDir = fs.readdirSync(inputFilePath);
            let renamedDir = await fsPromises.readdir(inputFilePath);

            for (let tv of renamedDir) {

                if (tvForFix.includes(tv) || tv.endsWith(".docx")) {

                    // const buffer = fs.readFileSync(`${inputFilePath}${tv}`);
                    const buffer = await fsPromises.readFile(`${inputFilePath}${tv}`);

                    if (tv.endsWith(".docx")) {
                        const encodedBuffer = await mammoth.extractRawText({ buffer });
                        const encodedTv = encodedBuffer.value;

                        const result = handleFixTv(encodedTv, tv);
                        let outputDir = paths.input;

                        const filename = tv.split(".")[0].toLocaleLowerCase();

                        const outputFile = `${outputDir}${filename}.txt`

                        // fs.writeFileSync(outputFile, result, { encoding: "utf-8" })
                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });
                    }

                    if (tv.endsWith(".txt")) {
                        let encodedTV = "";
                        let charSet = jschardet.detect(buffer).encoding;

                        if (charSet === "x-mac-cyrillic") {
                            charSet = "windows-1251";
                        };

                        encodedTV = iconv.decode(buffer, charSet);

                        const result = handleFixTv(encodedTV, tv);
                        let outputDir = paths.input;
                        let outputFile = `${outputDir}${tv}`

                        // fs.writeFileSync(outputFile, result, { encoding: "utf-8" });
                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });
                    }
                }

            }

            renamedDir = await fsPromises.readdir(inputFilePath);

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
                        await fsPromises.copyFile(`${paths.cache}${cacheFileName}`, `${inputFilePath}${tv}`);
                    } else {

                        const textTv = await fsPromises.readFile(`${inputFilePath}${tv}`, { encoding: "utf-8" });

                        const result = await translate(textTv);

                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });

                        await fsPromises.writeFile(`${paths.cache}${cacheFileName}`, result, { encoding: "utf-8" });
                    }

                }
            }


            return renamedTvCount;
        } catch (error) {
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
            throw (error)
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
            throw (error);
        };

    }
}
