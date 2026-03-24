import { EOL } from "os";

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
            result = encodedTV;
            break;
        case "HBO2.docx":
            result = encodedTV;
            break;
        case "HBO3.docx":
            result = encodedTV;
            break;
        case "Cinemax.docx":
            result = encodedTV;
            break;
        case "Cinemax2.docx":
            result = encodedTV;
            break;
    }

    return result;
}
