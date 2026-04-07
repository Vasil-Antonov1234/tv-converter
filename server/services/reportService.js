import fsPromises from "node:fs/promises";
import paths from "../paths/paths.js";
import { allTv } from "../data/tvPaths.js";
import { days } from "../data/tvNames.js";

export default {
    async baseReport(renamedFilesCount) {
        const dir = await fsPromises.readdir(paths.input);
        const allFiles = allTv;

        const missingFiles = [];

        allFiles.forEach((tv) => dir.includes(tv) ? "" : missingFiles.push(`${tv} file is missing!`));

        const currentDate = new Date();
        const dayOfWeek = days[currentDate.getDay() - 1];
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const convertedCurrentDate = `${dayOfWeek} ${String(day).padStart(2, 0)}.${String(month).padStart(2, 0)}.${year}`

        const datesToCheck = [
            
        ]

        const report = {
            renamedFilesCount,
            missingFiles,
            convertedCurrentDate
        }

        return report;
    }
}