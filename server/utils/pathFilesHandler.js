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
            pathsFiles.web = paths.telSite;
            break;
        case "Weekend":
            pathsFiles.ready = paths.weekendFiles;
            let weekendIssue = issue.includes("-") ? issue.split("-")[0] : issue.split("_")[0];
            weekendIssue = extractedApplicationIssue ? weekendIssue = extractedApplicationIssue : weekendIssue;
            pathsFiles.photoOld = `${paths.photos}_WEEKEND ${weekendIssue}/OLD/`;
            pathsFiles.web = paths.telSite;
            break;
        case "ZlatnoVreme":
            pathsFiles.ready = `${paths.zlatno}${applicationIssue}/`;
            pathsFiles.photoOld = `${paths.photos}_ZLATNO VREME${extractedApplicationIssue}/OLD/`;
            pathsFiles.web = paths.zlatnoOutput;
            break;
        case "Agro":
            pathsFiles.ready = `${paths.agro}${applicationIssue}/old/`;
            pathsFiles.photoOld = `${paths.photos}_AGRO${extractedApplicationIssue}/OLD/`;
            pathsFiles.web = paths.agroOutput;
            break;
        case "Viara":
            pathsFiles.ready = `${paths.viara}${applicationIssue}/`;
            pathsFiles.photoOld = `${paths.photos}_VIARA${extractedApplicationIssue}/old/`;
            pathsFiles.web = `${paths.telSite}_____viara/`;
            break;
        case "Zdrave":
            pathsFiles.ready = `${paths.zdrave}`;
            pathsFiles.photoOld = `${paths.photos}_ZDRAVE${extractedApplicationIssue}/OLD/`;
            pathsFiles.web = `${paths.telSite}______Zdrave/`;
            break;
        case "Nedelnik":
            pathsFiles.ready = paths.nedelnik;
            pathsFiles.photoOld = `${paths.photos}_KULINAR${extractedApplicationIssue}/OLD/`;
            pathsFiles.web = `${paths.telSite}______Nedelnik/`;
            break;
    }

    return pathsFiles;
}
