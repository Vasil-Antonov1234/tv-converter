import fs from "node:fs";
import paths from "../paths/paths.js";

const inputFilePath = paths.input;
const dir = fs.readdirSync(inputFilePath);
const regex = /-\d\d./

if (dir.find((x) => x.includes("-"))) {

    for (let el of dir) {

        let fileName = el.replace(regex, ".");

        fs.rename(`${inputFilePath}${el}`, `${inputFilePath}${fileName}`, (error) => {

            if (error) {
                console.log(error)
            }
        });
    }

}