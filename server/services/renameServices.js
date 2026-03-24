import fs from "node:fs";
import fsPromises from "node:fs/promises";
import mammoth from "mammoth";
import paths from "../paths/paths.js";
import iconv from "iconv-lite";
import jschardet from "jschardet";
import { handleFixTv } from "../utils/handleFixTV.js";
import { tvForFix } from "../data/tvNames.js";
import fileExtensionHandler from "../utils/fileExtensionHandler.js";

const inputFilePath = paths.input;
const regex = /-\d\d.txt$|-\d\d.docx$/

export default {
    async renameAllTv() {

        try {
            const dir = fs.readdirSync(inputFilePath);
            let result = 0;

            if (dir.find((x) => x.includes("-"))) {

                for (let el of dir) {

                    const match = el.match(regex);

                    if (!match || (!el.endsWith(".txt") && !el.endsWith(".docx"))) {
                        continue;
                    };

                    const fileExtension = fileExtensionHandler(el);

                    result++;

                    let fileName = el.replace(regex, fileExtension);

                    fs.renameSync(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`);
                };
            };

            const renamedDir = fs.readdirSync(inputFilePath);

            for (let tv of renamedDir) {

                if (tvForFix.includes(tv)) {

                    const buffer = fs.readFileSync(`${inputFilePath}${tv}`);

                    if (tv.endsWith(".docx")) {
                        const encodedBuffer = await mammoth.extractRawText({ buffer });
                        const encodedTv = encodedBuffer.value;

                        const result = handleFixTv(encodedTv, tv);
                        let outputDir = paths.input;

                        const filename = tv.split(".")[0].toLocaleLowerCase();

                        const outputFile = `${outputDir}${filename}.txt`

                        fs.writeFileSync(outputFile, result, { encoding: "utf-8" })
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

                        fs.writeFileSync(outputFile, result, { encoding: "utf-8" });
                    }
                }
            }

            return result;
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
