export function errorMessageHandler(error) {
    let result = "Cannot read the error!"

    if (error.message) {
        result = error.message;
    } else {
        result = error
    }

    return result;
}