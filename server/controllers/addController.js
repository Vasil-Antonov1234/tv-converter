import { Router } from "express";
import fs from "node:fs";
import iconv from "iconv-lite";
import jschardet from "jschardet";
import { EOL } from "os";

import { allTvNames, isMissingTvNames } from "../data/tvNames.js"
import { allTv } from "../data/tvPaths.js"
import { handleDay, handleOutputDay } from "../utils/handleDay.js"
import { handleEndOfCurrentTv } from "../utils/handleEndOfCuttentTv.js"
import paths from "../paths/paths.js";

const inputFilePath = paths.input;

const addController = Router();

addController.post("/", (req, res) => {
    const dir = fs.readdirSync(inputFilePath);
    const tvArr = [];

    const day = req.body.day;
    const date = req.body.date;

    const response = [];

    for (let i = 0; i < 46; i++) {

        if (!dir.includes(allTv[i])) {
            tvArr.push(`${isMissingTvNames[i]}\n`);
            response.push(`${allTv[i]} - File is missing! ❌`)
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
            tvArr.push(`${isMissingTvNames[i]}\n`);
            response.push(`${allTvNames[i]} - NO DATA! ❌`)
            continue;
        }

        tvArr.push(allTvNames[i]);
        response.push(`${allTvNames[i]} - OK ✅`);

        splittedTV = encodedTV.split("\n");

        let isCurrentDay = false;

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

            // row !== EOL
            // EOL + EOL
        }
    }

    let result = tvArr.join("\n");
    result = result.replaceAll("•", "-");

    const outputDir = paths.output;

    const outputFile = `${outputDir}${handleOutputDay(day)}-${date}.txt`

    fs.writeFileSync(outputFile, result, { encoding: "utf-8" });

    res.status(201);
    res.send(JSON.stringify(response));
})

export default addController;