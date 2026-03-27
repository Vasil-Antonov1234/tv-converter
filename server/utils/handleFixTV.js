import { EOL } from "os";
import fixDateDoxcHandler from "./fixDateDoxcHandler.js";

export function handleFixTv(encodedTV, tv) {

    let result = "";

    if (tv === "dizi.txt") {
        result = encodedTV.replaceAll("---", "");
    }

    if (tv === "FilmBox Basic.txt") {
        result = `FilmBox Basic${EOL}${EOL}${encodedTV}`;
    }

    if (tv.endsWith(".docx")) {
        result = fixDateDoxcHandler(encodedTV);
    }

    return result;
}
