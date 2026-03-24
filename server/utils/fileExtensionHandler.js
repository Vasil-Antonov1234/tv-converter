export default function fileExtensionHandler(fileName) {
    
    if (fileName.endsWith(".txt")) {
        return ".txt"
    };

    if (fileName.endsWith(".docx")) {
        return ".docx";
    };

    return "";
}