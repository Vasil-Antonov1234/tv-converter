export async function translate(tv) {
    let result = tv.split("\n");
    const arrForTranslate = [];
    const staticArr = [];

    for (let i = 0; i < result.length; i++) {
        let row = result[i];

        if (!row.includes("Episode")) {
            arrForTranslate.push("~");
            staticArr.push(row);
            continue;
        };

        row = row.replace("Episode", "Епизод");
        let tokens = row.split("Епизод")
        const firstPart = tokens[0];
        // const firstPart = tokens.shift();
        arrForTranslate.push(firstPart);

        const secondPart = tokens[1];
        // const secondPart = tokens.join(" Епизод");
        staticArr.push(secondPart);


        // const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(firstPart)}&langpair=en|bg`;
        // const response = await fetch(url);
        // const data = await response.json();
        // const translatedFirstPart = data.responseData.translatedText;

        // tokens.splice(0, 1, translatedFirstPart);

        // row = tokens.join(" Епизод");

        // result[i] = row;
    };

    const interval = arrForTranslate.length / 8;

    const part1 = arrForTranslate.slice(0, interval);
    const part2 = arrForTranslate.slice(interval, interval * 2);
    const part3 = arrForTranslate.slice(interval * 2, interval * 3);
    const part4 = arrForTranslate.slice(interval * 3, interval * 4);
    const part5 = arrForTranslate.slice(interval * 4, interval * 5);
    const part6 = arrForTranslate.slice(interval * 5, interval * 6);
    const part7 = arrForTranslate.slice(interval * 6, interval * 7);
    const part8 = arrForTranslate.slice(interval * 7, arrForTranslate.length);

    const arr = [part1, part2, part3, part4, part5, part6, part7, part8];
    const convertedArr = [];

    for (let i = 0; i < arr.length; i++) {
        const translatedText = await request(arr[i].join("\n"));
        convertedArr.push((translatedText).split("\n"));
    }

    let translatedArr = [];

    convertedArr.forEach((arr) => translatedArr = translatedArr.concat(arr));

    // const translatedArr = part1.concat(part2, part3, part4, part5, part6, part7, part8)

    for (let i = 0; i < result.length; i++) {
        let translatedPart = translatedArr[i];

        if(translatedPart.includes("~")) {
            continue;
        }
        
        let row = `${translatedArr[i]} Епизод${staticArr[i]}`;

        result[i] = row;
    }

    return result.join("\n");

}

async function request(text) {

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|bg`;
    const response = await fetch(url);
    const result = await response.json();
    const translatedFirstPart = result.responseData.translatedText;

    // const translatedText = `${text} - Translated`

    return translatedFirstPart;
}