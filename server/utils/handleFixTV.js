import { EOL } from "os";
import fixDateDoxcHandler from "./fixDateDoxcHandler.js";

export function handleFixTv(encodedTV, tv) {

    let result = "";

    switch (tv) {
        case "dizi.txt":
            result = encodedTV.replaceAll("---", "");
            break;
        case "FilmBox Basic.txt":
            result = `FilmBox Basic${EOL}${EOL}${encodedTV}`;
            break;
        case "HBO.docx":
            result = fixDateDoxcHandler(encodedTV);
            break;
        case "HBO2.docx":
            result = fixDateDoxcHandler(encodedTV);
            break;
        case "HBO3.docx":
            result = fixDateDoxcHandler(encodedTV);
            break;
        case "Cinemax.docx":
            result = fixDateDoxcHandler(encodedTV);
            break;
        case "Cinemax2.docx":
            result = fixDateDoxcHandler(encodedTV);
            break;
    }

    return result;
}
