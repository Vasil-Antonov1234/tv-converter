import { EOL } from "os";
import fsPromises from "node:fs/promises"
import { allTvNames } from "../data/tvNames.js";
import { allTv } from "../data/tvPaths.js";
import { handleOutputDay } from "../utils/handleDay.js";
import { handleEndOfCurrentTv } from "../utils/handleEndOfCuttentTv.js";
import paths from "../paths/paths.js";
import { errorLocationMapper } from "../utils/errorMessageHandler.js";
import tvRepository from "../repositories/tvRepository.js";

export default {
    async createTv(day, date) {

        try {
            return await tvRepository.createOne(day, date);
        } catch (error) {
            errorLocationMapper(error, "tvService.createTv");
            throw error;
        };
    }
}
