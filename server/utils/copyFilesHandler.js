import { handleAgroZlatnoIssue } from "./handleAgroZlatnoIssue";

export async function copyFilesHandler(issueNumber, application, pathInputFiles, pathInputFotos, filesOutput) {
    const notCopiedFiles = [];
    let report = "Done";

    let dirFilesSource = "";
    let dirPhotosSource = "";
    let dirTelSite = "";
    let weekendIssue = "";

    weekendIssue = issueNumber.includes("-") ? issueNumber.split("-")[0] : issueNumber.split("_")[0];

    const photoIssue = handleAgroZlatnoIssue(issueNumber);

    try {
        dirFilesSource = await fsPromises.readdir(pathInputFiles);
        dirPhotosSource = await fsPromises.readdir(pathInputFotos);
        dirTelSite = await fsPromises.readdir(filesOutput);

        const dirFiles = dirFilesSource.filter((x) =>
            x.endsWith(".txt") ||
            x.endsWith(".doc") ||
            x.endsWith(".odt") ||
            x.endsWith(".docx")
        );

        const dirPhotos = dirPhotosSource.filter((x) =>
            x.endsWith(".jpg") ||
            x.endsWith(".JPG") ||
            x.endsWith(".jpeg") ||
            x.endsWith(".bmp") ||
            x.endsWith(".png") ||
            x.endsWith(".gif") ||
            x.endsWith(".webp")
        );

        await fsPromises.mkdir(filesOutput / issueNumber);

    } catch (error) {
        throw error.message;
    };

}
