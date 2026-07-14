export function errorMessageHandler(error) {
    let result = "Cannot read the error!"

    if (error.message) {
        result = error.message;
    } else {
        result = error
    }

    console.log(error.location.reverse().join("=> \n"));
    return result;
}

export function errorLocationMapper(error, location) {

    if (!error.location) {
        error.location = [];
    };

    if (location) {
        error.location.push(location);
    };
};