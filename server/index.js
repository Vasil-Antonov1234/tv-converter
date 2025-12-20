import fs from "node:fs";
import iconv from "iconv-lite";
import jschardet from "jschardet";

import { allTvNames, isMissingTvNames } from "./data/tvNames.js"
import { allTv } from "./data/tvPaths.js";
import { handleDay, handleOutputDay } from "./utils/handleDay.js";
import { handleEndOfCurrentTv } from "./utils/handleEndOfCuttentTv.js";
import paths from "./paths/paths.js";

// const bufferBnt1 = fs.readFileSync("D:/-TV-/bg/ntv-13.txt");
// const encodedBnt1 = iconv.decode(bufferBnt1, "win1251");
// const a = bufferBnt1.toString("utf-8");

const inputFilePath = paths.input;
const dir = fs.readdirSync(inputFilePath);

const tvArr = [];

const day = paths.day;
const date = paths.date;

for (let i = 0; i < 46; i++) {

    if (!dir.includes(allTv[i])) {
        tvArr.push(`${isMissingTvNames[i]}\n`);
        continue;
    }

    const buffer = fs.readFileSync(`${inputFilePath}${allTv[i]}`);

    let charSet = jschardet.detect(buffer).encoding;

    if (charSet === "x-mac-cyrillic") {
        charSet = "windows-1251"
    }

    let encodedTV = ""
    
    encodedTV = iconv.decode(buffer, charSet);
       
    encodedTV = handleDay(encodedTV);
    let splittedTV = []

    if (!encodedTV.includes(`${day} ${date}`)) {
        tvArr.push(`${isMissingTvNames[i]}\n`);
        continue;
    }

    tvArr.push(allTvNames[i]);

    splittedTV = encodedTV.split("\n");

    let isCurrentDay = false

    for (let row of splittedTV) {

        if (handleEndOfCurrentTv(row) && isCurrentDay) {
            isCurrentDay = false
            tvArr.push("\n")
            break;
        }
        
        if ((row === `${day} ${date}\r` || row === `${day} ${date}`) && !isCurrentDay) {
            isCurrentDay = true
        };

        if (isCurrentDay && row !== "" && row !== "\r" && row !== "\n") {
            tvArr.push(row)
        }
    }
}

let result = tvArr.join("\n");
result = result.replaceAll("•", "-");

const outputDir = paths.output;

const outputFile = `${outputDir}${handleOutputDay(day)}-${date}.txt`

fs.writeFileSync(outputFile, result, { encoding: "utf-8" });
