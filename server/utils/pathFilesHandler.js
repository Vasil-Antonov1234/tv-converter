import paths from "../paths/paths.js";
import "dotenv/config";

export function pathsHandler(applicationType, currentIssueOrAppNumber, photoOldNumber, applicationFolderName) {

    const pathsFiles = {
        ready: "",
        photoOld: "",
        web: ""
    }

    switch (applicationType) {
        case "currentIssue":
            pathsFiles.ready = process.env.READY_FILES;
            pathsFiles.photoOld = `${process.env.PHOTOS}Telegraph_OLD/`;
            pathsFiles.web = process.env.TEL_SITE;
            break;
        case "Weekend":
            pathsFiles.ready = process.env.WEEKEND_FILES;
            pathsFiles.photoOld = `${process.env.PHOTOS}_WEEKEND ${photoOldNumber}/OLD/`;
            pathsFiles.web = process.env.TEL_SITE;
            break;
        case "ZlatnoVreme":
            pathsFiles.ready = `${process.env.ZLATNO}${applicationFolderName}/`;
            pathsFiles.photoOld = `${process.env.PHOTOS}_ZLATNO VREME${photoOldNumber}/OLD/`;
            pathsFiles.web = process.env.ZLATNO_OUTPUT;
            break;
        case "Agro":
            pathsFiles.ready = `${process.env.AGRO}${applicationFolderName}/old/`;
            pathsFiles.photoOld = `${process.env.PHOTOS}_AGRO${photoOldNumber}/OLD/`;
            pathsFiles.web = process.env.AGRO_OUTPUT;
            break;
        case "Viara":
            pathsFiles.ready = `${process.env.VIARA}${applicationFolderName}/`;
            pathsFiles.photoOld = `${process.env.PHOTOS}_VIARA${photoOldNumber}/old/`;
            pathsFiles.web = `${process.env.TEL_SITE}_____viara/`;
            break;
        case "Nedelnik":
            pathsFiles.ready = `${process.env.NEDELNIK}${applicationFolderName}/`;
            pathsFiles.photoOld = `${process.env.PHOTOS}_KULINAR${photoOldNumber}/OLD/`;
            pathsFiles.web = `${process.env.TEL_SITE}______Nedelnik/`;
            break;
        case "Zdrave":
            pathsFiles.ready = `${process.env.ZDRAVE}${applicationFolderName}/`;
            pathsFiles.photoOld = `${process.env.PHOTOS}_ZDRAVE${photoOldNumber}/OLD/`;
            pathsFiles.web = `${process.env.TEL_SITE}______Zdrave/`;
    };

    return pathsFiles;
}
