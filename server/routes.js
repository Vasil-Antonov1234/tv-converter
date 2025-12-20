import { Router } from "express";
import renameController from "./controllers/renameController.js"
import paths from "./paths/paths.js";
import fs from "node:fs";

const routes = Router();

// routes.use("/tv/rename", (req, res) => {
//     res.send("Test")
// });

routes.use("/rename", (req, res) => {
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
    res.send(`${dir.length} files has been renamed!`);
});

routes.use("/tv", renameController);

export default routes;
