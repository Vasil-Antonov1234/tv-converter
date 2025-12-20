import { Router } from "express";
import fs from "node:fs";
import paths from "../paths/paths.js";

const renameController = Router();

renameController.get("/rename", (req, res) => {
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

    let response = JSON.stringify(`${dir.length} files has been renamed!`);

    if (dir.length < 2) {
        response = JSON.stringify("There are no files in the input folder!");
    }

    res.send(response);
});

export default renameController;
