import paths from "../paths/paths.js";

export function pathsHandler(application, issueNumber, photoIssue) {

    const pathsFiles = {
        ready: "",
        photoOld: "",
        web: ""
    }

    switch (application) {
        case "currentIssue":
            pathsFiles.ready = paths.readyFiles;
            pathsFiles.photoOld = `${paths.photos}Telegraph_OLD/`;
            pathsFiles.web = paths.telSite
            break;
        case "Weekend":
            pathsFiles.ready = paths.weekendFiles;
            const weekendIssue = issueNumber.includes("-") ? issueNumber.split("-")[0] : issueNumber.split("_")[0];
            pathsFiles.photoOld = `${paths.photos}_WEEKEND ${weekendIssue}/OLD/`;
            pathsFiles.web = paths.telSite
            break;
        case "ZlatnoVreme":
            pathsFiles.ready = `${paths.zlatno}${issueNumber}/`;
            pathsFiles.photoOld = `${paths.photos}_ZLATNO_VREME${photoIssue}/OLD/`;
            pathsFiles.web = paths.zlatnoOutput;
            break;
        case "Agro":
            pathsFiles.ready = `${paths.agro}${issueNumber}/old/`;
            pathsFiles.photoOld = `${paths.photos}_AGRO${photoIssue}/OLD/`;
            pathsFiles.web = paths.agroOutput;
    }

    return pathsFiles;
}