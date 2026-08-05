import paths from "../paths/paths.js";

export function pathsHandler(applicationType, currentIssueOrAppNumber, photoOldNumber, applicationFolderName) {

    const pathsFiles = {
        ready: "",
        photoOld: "",
        web: ""
    }

    switch (applicationType) {
        case "currentIssue":
            pathsFiles.ready = paths.readyFiles;
            pathsFiles.photoOld = `${paths.photos}Telegraph_OLD/`;
            pathsFiles.web = paths.telSite;
            break;
        case "Weekend":
            pathsFiles.ready = paths.weekendFiles;
            pathsFiles.photoOld = `${paths.photos}_WEEKEND ${photoOldNumber}/OLD/`;
            pathsFiles.web = paths.telSite;
            break;
        case "ZlatnoVreme":
            pathsFiles.ready = `${paths.zlatno}${applicationFolderName}/`;
            pathsFiles.photoOld = `${paths.photos}_ZLATNO VREME${photoOldNumber}/OLD/`;
            pathsFiles.web = paths.zlatnoOutput;
            break;
        case "Agro":
            pathsFiles.ready = `${paths.agro}${applicationFolderName}/old/`;
            pathsFiles.photoOld = `${paths.photos}_AGRO${photoOldNumber}/OLD/`;
            pathsFiles.web = paths.agroOutput;
            break;
        case "Viara":
            pathsFiles.ready = `${paths.viara}${applicationFolderName}/`;
            pathsFiles.photoOld = `${paths.photos}_VIARA${photoOldNumber}/old/`;
            pathsFiles.web = `${paths.telSite}_____viara/`;
            break;
        case "Zdrave":
            pathsFiles.ready = `${paths.zdrave}`;
            pathsFiles.photoOld = `${paths.photos}_ZDRAVE${photoOldNumber}/OLD/`;
            pathsFiles.web = `${paths.telSite}______Zdrave/`;
            break;
        case "Nedelnik":
            pathsFiles.ready = paths.nedelnik;
            pathsFiles.photoOld = `${paths.photos}_KULINAR${photoOldNumber}/OLD/`;
            pathsFiles.web = `${paths.telSite}______Nedelnik/`;
            break;
    }

    return pathsFiles;
}
