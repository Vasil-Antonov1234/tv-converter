import fs from "node:fs";
import paths from "../paths/paths.js";

const inputFilePath = paths.input;
const regex = /-\d\d.txt/

export default {
    renameAllTv() {

        try {
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
        } catch (error) {
            console.log(error.message);
            throw (error.message);
        }


    },

    renameFiles(path, find, changeTo, extension) {

        try {
            let dir = fs.readdirSync(path);
            let result = 0;

            if (extension) {
                dir = dir.filter((file) => file.endsWith(`.${extension}`));
            };

            for (let file of dir) {

                if (file.includes(find)) {
                    const newFileName = file.replace(find, changeTo);

                    fs.renameSync(`${path}/${file}`, `${path}/${newFileName}`);

                    result++
                }
            }

            return result;


        } catch (error) {
            throw (error.message)
        }

    }
}
