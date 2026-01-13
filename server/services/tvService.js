import fs from "node:fs";
import iconv from "iconv-lite";
import jschardet from "jschardet";
import { EOL } from "os";

import { allTvNames } from "../data/tvNames.js";
import { allTv } from "../data/tvPaths.js";
import { handleDay, handleOutputDay } from "../utils/handleDay.js";
import { handleEndOfCurrentTv } from "../utils/handleEndOfCuttentTv.js";
import paths from "../paths/paths.js";

const inputFilePath = paths.input;

export default {
    createTv(day, date) {

        try {
            const dir = fs.readdirSync(inputFilePath);
            const tvArr = [];

            const response = [];

            for (let i = 0; i < 46; i++) {

                if (!dir.includes(allTv[i])) {
                    tvArr.push(`${allTvNames[i]}${EOL}${day} ${date}${EOL}`);
                    response.push(`${allTv[i]} (${allTvNames[i]}) - File is missing! ❌`)
                    continue;
                }

                const buffer = fs.readFileSync(`${inputFilePath}${allTv[i]}`);

                let charSet = jschardet.detect(buffer).encoding;

                if (charSet === "x-mac-cyrillic") {
                    charSet = "windows-1251";
                };

                let encodedTV = "";

                encodedTV = iconv.decode(buffer, charSet);

                encodedTV = handleDay(encodedTV);
                let splittedTV = [];

                if (!encodedTV.includes(`${day} ${date}`)) {
                    tvArr.push(`${allTvNames[i]}${EOL}${day} ${date}${EOL}`);
                    response.push(`${allTvNames[i]} - NO DATA! ❌ (${allTv[i]})`);
                    continue;
                }

                tvArr.push(allTvNames[i]);

                splittedTV = encodedTV.split("\n");

                let isCurrentDay = false;

                for (let row of splittedTV) {

                    if (handleEndOfCurrentTv(row) && isCurrentDay) {
                        isCurrentDay = false
                        break;
                    }

                    if (row.startsWith(`${day} ${date}`) && !isCurrentDay) {
                        isCurrentDay = true
                    };

                    if (isCurrentDay && row !== "" && row !== "\r" && row !== "\n") {
                        tvArr.push(row);
                    };
                };

                if (tvArr.length > 3) {
                    response.push(`${allTvNames[i]} - OK ✅`);
                }

                if (tvArr.length < 3) {
                    response.push(`${allTvNames[i]} - NO DATA! ❌ (${allTv[i]})`);
                }

                tvArr.push(EOL);
            };

            let result = tvArr.join("\n");
            result = result.replaceAll("•", "-").trim();

            const outputDir = paths.output;

            const outputFile = `${outputDir}${handleOutputDay(day)}-${date}.txt`

            fs.writeFileSync(outputFile, result, { encoding: "utf-8" });

            return response;
        } catch (error) {
            console.log(error.path)
            throw(error);
        };
    }
}
