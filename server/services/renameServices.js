import fs from "node:fs";
import paths from "../paths/paths.js";

const inputFilePath = paths.input;
const regex = /-\d\d.txt/

export default {
    renameAllTv() {
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

                fs.rename(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`, (error) => {

                    if (error) {
                        console.log(error)
                    }
                });
            };
        };

        return result;
    }
}
