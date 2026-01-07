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
    }

    return result;
}
