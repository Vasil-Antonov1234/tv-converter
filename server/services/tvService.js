import { EOL } from "os";
import fsPromises from "node:fs/promises"
import { allTvNames } from "../data/tvNames.js";
import { allTv } from "../data/tvPaths.js";
import { handleNextWeekTvDates, handleOutputDay } from "../utils/handleDay.js";
import { handleEndOfCurrentTv } from "../utils/handleEndOfCuttentTv.js";
import paths from "../paths/paths.js";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import tvRepository from "../repositories/tvRepository.js";
import fileExtensionHandler from "../utils/fileExtensionHandler.js";
import fileRepository from "../repositories/fileRepository.js";
import reportHandler from "../utils/reportHandler.js";

export default {
    async createTv(day, date) {

        try {
            return await tvRepository.createOne(day, date);
        } catch (error) {
            errorLocationMapper(error, "tvService.createTv");
            throw error;
        };
    },

    async createAll(datesForTvCreation) {

        try {
            datesForTvCreation.forEach(async (x) => {
                const day = x.split(" ")[0];
                const date = x.split(" ")[1];

                await tvRepository.createOne(day, date);
            });
        } catch (error) {
            errorLocationMapper(error, "tvService.createAll");
            throw error;
        };
    },

    async renameMany() {
        const regex = /-\d\d.txt$|-\d\d.docx$/

        try {
            const dir = await fileRepository.readDirectoryContent(paths.input);

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

                    await fileRepository.rename(`${paths.input}${el}`, `${paths.input}${fileName}`);
                };
            };

            await tvRepository.encodeMany();

            const diziState = await tvRepository.translateTV();

            return { renamedTvCount, diziState };
        } catch (error) {
            errorLocationMapper(error, "tvService.renameMany");
            throw error;
        };

    },

    async baseReport(renamedFilesCount, startDate, finalDate) {

        try {
            const dir = await fileRepository.readDirectoryContent(paths.input);

            const allFiles = allTv;
            const missingFiles = [];

            allFiles.forEach((tv) => dir.includes(tv) ? "" : missingFiles.push(`${tv} file is missing!`));

            const datesToCheck = handleNextWeekTvDates(startDate, finalDate);

            const { allMissindData, missingData } = await reportHandler.weekDaysDataReport(datesToCheck, dir);

            const report = {
                renamedFilesCount,
                missingFiles,
                missingData,
                allMissindData,
                datesToCheck
            };

            return report;
        } catch (error) {
            errorLocationMapper(error, "tvService.baseReport");
            throw error;
        };
    }
}
