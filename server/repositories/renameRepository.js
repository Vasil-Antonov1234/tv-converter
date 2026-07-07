import fsPromises from "fs/promises";
import paths from "../paths/paths.js";
import { tvForTranslate } from "../data/tvNames.js";
import { translate } from "../utils/translate.js";

export default {
    async translateTV() {

        try {
            const renamedDir = await fsPromises.readdir(paths.input);
            let diziState = "normal";

            for (let tv of renamedDir) {

                if (tvForTranslate.includes(tv)) {
                    let outputDir = paths.input;
                    let outputFile = `${outputDir}${tv}`

                    const date = new Date();
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const cacheFileName = `translated-${day}-${month}-${year}-${tv}`


                    const cacheDir = await fsPromises.readdir(paths.cache);

                    if (cacheDir.includes(cacheFileName)) {
                        diziState = "cached"
                        await fsPromises.copyFile(`${paths.cache}${cacheFileName}`, `${paths.input}${tv}`);
                    } else {

                        const textTv = await fsPromises.readFile(`${paths.input}${tv}`, { encoding: "utf-8" });

                        const result = await translate(textTv);

                        await fsPromises.writeFile(outputFile, result, { encoding: "utf-8" });

                        await fsPromises.writeFile(`${paths.cache}${cacheFileName}`, result, { encoding: "utf-8" });
                    };
                };
            };

            return diziState;
        } catch (error) {
            throw error
        };
    }
}