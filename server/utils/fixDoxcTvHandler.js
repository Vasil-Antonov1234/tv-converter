export function fixDoxcTvHandler(tv, fileName) {

    const tvGenres = tv.filter((x) => x.startsWith("Genre:"))

    if (tvGenres.length === 0) {
        return tv.join("\n");
    };

    const genres = {
        "Action": "Екшън",
        "Comedy": "Комедия",
        "Drama": "Драма",
        "Horror": "Ужаси",
        "Dramedy": "Драма, Комедия",
        "History": "Исторически",
        "Thriller": "Трилър",
        "Crime": "Криминален",
        "Mystery": "Мистерия",
        "Fantasy": "Фентъзи",
        "Science fiction": "Фантастика",
        "Sci-fi": "Фантастика",
        "Biography": "Биографичен",
        "Animation": "Анимация",
        "Documentary": "Документален",
        "Romance": "Романтичен",
        "Talk-Show": "Токшоу",
        "Animation": "Анимация"
    }

    const tvName = fileName.split(".")[0].toUpperCase();

    for (let i = 0; i < tv.length; i++) {
        tv[i] = tv[i].replaceAll("-", "");
        let row = tv[i];

        if (forDelete(row)) {
            tv[i] = "~deleted~"
        };

    }

    tv = tv.filter((x) => x !== "~deleted~");
    const hourregexPattern = /^\d\d:\d\d/;
    const regexDatePattern = /\d\d\.\d\d\.\d\d\d\d/;

    let result = tv.join("\n").split("\n");

    for (let i = 0; i < result.length; i++) {
        let row = result[i];

        if (!row.match(hourregexPattern) && !row.match(regexDatePattern)) {
            result.splice(i, 1)
        }

    }
    
    let genreIndex = 0;
    for (let i = 0; i < result.length; i++) {
        let row = result[i];

        if (row.startsWith("0") ||
            row.startsWith("1") ||
            row.startsWith("2") ||
            row.startsWith("3") ||
            row.startsWith("4") ||
            row.startsWith("5") ||
            row.startsWith("6") ||
            row.startsWith("7") ||
            row.startsWith("8") ||
            row.startsWith("9")
    ) {
        const tokens = tvGenres[genreIndex].replaceAll(",", "").split(" ");
        let genre = genres[tokens[1]];

        genre = genre === undefined ? "" : genre;
        
        result[i] = `${row} - ${genre}`
        genreIndex++
        }
    }

    return result.join("\n").replace("undefined NaN.NaN.NaN", tvName)
}


function forDelete(row) {
    if (row.startsWith("Duration:") ||
        row.startsWith("Cast:") ||
        row.startsWith("Director:") ||
        row.startsWith("Origin:") ||
        row.startsWith("Genre:") ||
        row.startsWith("Production year:") ||
        row.startsWith("Parental rating:") ||
        row.startsWith("Original title:") ||
        row.startsWith("Season:") ||
        row.startsWith("Series original title:") ||
        row.startsWith("Episode original title:") ||
        row.startsWith("Also") ||
        row.startsWith('"') ||
        row.length > 51
    ) {
        return true
    }

    return false
}