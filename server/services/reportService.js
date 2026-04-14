import fsPromises from "node:fs/promises";
import paths from "../paths/paths.js";
import { allTv } from "../data/tvPaths.js";
import { handleNextWeekTvDates } from "../utils/handleDay.js";
import reportHandler from "../utils/reportHandler.js";

export default {
    async baseReport(renamedFilesCount, startDate, finalDate) {
        const dir = await fsPromises.readdir(paths.input);
        const allFiles = allTv;

        const missingFiles = [];

        allFiles.forEach((tv) => dir.includes(tv) ? "" : missingFiles.push(`${tv} file is missing!`));

        // TODO option to set datesToCheck manualy
        // in the app, if the day is not Monday or Tuesday, require that the dates for check to be set manyally
        const datesToCheck = handleNextWeekTvDates(startDate, finalDate);
        const { allMissindData, missingData } = await reportHandler.weekDaysDataReport(datesToCheck, dir);

        const report = {
            renamedFilesCount,
            missingFiles,
            missingData,
            allMissindData
        }

        return report;
    }
}