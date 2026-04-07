import { allTv } from "../data/tvPaths.js";
import fsPromisses from "node:fs/promises";
import paths from "../paths/paths.js";
import { allTvNames } from "../data/tvNames.js";
import iconv from "iconv-lite";
import { handleDay } from "./handleDay.js";
import jschardet from "jschardet"

export default {
    async weekDaysDataReport(datesToCheck, dir) {
        const monday = [];
        const tuesday = [];
        const wednesday = [];
        const thursday = [];
        const friday = [];
        const saturday = [];
        const sunday = [];

        const week = [friday, saturday, sunday, monday, tuesday, wednesday, thursday];

        for (let i = 0; i < allTv.length; i++) {
            let tv = allTv[i];

            if (!dir.includes(tv)) {
                continue;
            };

            // const currentTv = await fsPromisses.readFile(`${paths.input}${tv}`, { encoding: "utf-8" });

            const buffer = await fsPromisses.readFile(`${paths.input}${tv}`);
            let charSet = jschardet.detect(buffer).encoding;

            if (charSet === "x-mac-cyrillic") {
                charSet = "windows-1251";
            };

            let currentTv = "";
            currentTv = iconv.decode(buffer, charSet);
            currentTv = handleDay(currentTv);



            for (let k = 0; k < datesToCheck.length; k++) {
                let day = datesToCheck[k];

                if (!currentTv.includes(day)) {

                    if (week[k].length === 0) {
                        week[k].push(`${day}`);
                    };

                    week[k].push(`${allTvNames[i]} - ${tv} - missing data!`);
                }

            }
        }

        let result = [];

        week.forEach((x) => result.push(x.join("\n")));

        result = result.filter((x) => x.length > 0);

        return result.join("\n");
    }
}