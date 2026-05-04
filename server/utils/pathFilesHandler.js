import paths from "../paths/paths.js";

export function pathsHandler(application, issue, extractedApplicationIssue, applicationIssue) {

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
            const weekendIssue = issue.includes("-") ? issue.split("-")[0] : issue.split("_")[0];
            pathsFiles.photoOld = `${paths.photos}_WEEKEND ${weekendIssue}/OLD/`;
            pathsFiles.web = paths.telSite
            break;
        case "ZlatnoVreme":
            pathsFiles.ready = `${paths.zlatno}${applicationIssue}`;
            pathsFiles.photoOld = `${paths.photos}_ZLATNO VREME${extractedApplicationIssue}/OLD/`;
            pathsFiles.web = paths.zlatnoOutput;
            break;
        case "Agro":
            pathsFiles.ready = `${paths.agro}${applicationIssue}/old/`;
            pathsFiles.photoOld = `${paths.photos}_AGRO${extractedApplicationIssue}/OLD/`;
            pathsFiles.web = paths.agroOutput;
        case "Viara":
            pathsFiles.ready = `${paths.viara}${applicationIssue}`;
            pathsFiles.photoOld = `${paths.photos}_VIARA${extractedApplicationIssue}/old/`;
            pathsFiles.web = `${paths.telSite}_____viara/`;
    }

    return pathsFiles;
}
