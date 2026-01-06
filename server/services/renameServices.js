import fs from "node:fs";
import fsPromises from "node:fs/promises";
import paths from "../paths/paths.js";
import iconv from "iconv-lite";
import jschardet from "jschardet";
import { EOL } from "os";
import { handleFixTv } from "../utils/handleFixTV.js";

const inputFilePath = paths.input;
const regex = /-\d\d.txt/

export default {
    renameAllTv() {

        try {
            const dir = fs.readdirSync(inputFilePath);
            let result = 0;

            if (dir.find((x) => x.includes("-"))) {

                for (let el of dir) {

                    const match = el.match(regex);

                    if (!match || !el.endsWith(".txt")) {
                        continue;
                    };

                    result++;

                    let fileName = el.replace(regex, ".txt");

                    // fs.rename(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`, (error) => {

                    //     if (error) {
                    //         throw error;
                    //     };
                    // });

                    fs.renameSync(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`);
                };
            };

            const renamedDir = fs.readdirSync(inputFilePath);

            for (let tv of renamedDir) {

                if (tv === "dizi.txt" || tv === "FilmBox Basic.txt") {

                    try {
                        const buffer = fs.readFileSync(`${inputFilePath}${tv}`);
                        let charSet = jschardet.detect(buffer).encoding;

                        if (charSet === "x-mac-cyrillic") {
                            charSet = "windows-1251";
                        };

                        let encodedTV = "";

                        encodedTV = iconv.decode(buffer, charSet);

                        const result = handleFixTv(encodedTV, tv);

                        // encodedTV = encodedTV.replaceAll("---", EOL);

                        const outputDir = paths.input;

                        const outputFile = `${outputDir}dizi.txt`;

                        fs.writeFileSync(outputFile, result, { encoding: "utf-8" });

                    } catch (error) {
                        throw error;
                    }
                }
            }

            return result;
        } catch (error) {
            console.log(error.message);
            throw (error.message);
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
            throw (error.message)
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
