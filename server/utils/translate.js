export async function translate(tv) {
    
    if (!tv.includes("Episode")) {
        return tv;
    }
    
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

    const interval = arrForTranslate.length / 30;

    const part1 = arrForTranslate.slice(0, interval);
    const part2 = arrForTranslate.slice(interval, interval * 2);
    const part3 = arrForTranslate.slice(interval * 2, interval * 3);
    const part4 = arrForTranslate.slice(interval * 3, interval * 4);
    const part5 = arrForTranslate.slice(interval * 4, interval * 5);
    const part6 = arrForTranslate.slice(interval * 5, interval * 6);
    const part7 = arrForTranslate.slice(interval * 6, interval * 7);
    const part8 = arrForTranslate.slice(interval * 7, interval * 8);
    const part9 = arrForTranslate.slice(interval * 8, interval * 9);
    const part10 = arrForTranslate.slice(interval * 9, interval * 10);
    const part11 = arrForTranslate.slice(interval * 10, interval * 11);
    const part12 = arrForTranslate.slice(interval * 11, interval * 12);
    const part13 = arrForTranslate.slice(interval * 12, interval * 13);
    const part14 = arrForTranslate.slice(interval * 13, interval * 14);
    const part15 = arrForTranslate.slice(interval * 14, interval * 15);
    const part16 = arrForTranslate.slice(interval * 15, interval * 16);
    const part17 = arrForTranslate.slice(interval * 16, interval * 17);
    const part18 = arrForTranslate.slice(interval * 17, interval * 18);
    const part19 = arrForTranslate.slice(interval * 18, interval * 19);
    const part20 = arrForTranslate.slice(interval * 19, interval * 20);
    const part21 = arrForTranslate.slice(interval * 20, interval * 21);
    const part22 = arrForTranslate.slice(interval * 21, interval * 22);
    const part23 = arrForTranslate.slice(interval * 22, interval * 23);
    const part24 = arrForTranslate.slice(interval * 23, interval * 24);
    const part25 = arrForTranslate.slice(interval * 24, interval * 25);
    const part26 = arrForTranslate.slice(interval * 25, interval * 26);
    const part27 = arrForTranslate.slice(interval * 26, interval * 27);
    const part28 = arrForTranslate.slice(interval * 27, interval * 28);
    const part29 = arrForTranslate.slice(interval * 28, interval * 29);
    const part30 = arrForTranslate.slice(interval * 29, interval * 30);

    const arr = [
        part1,
        part2,
        part3,
        part4,
        part5,
        part6,
        part7,
        part8,
        part9,
        part10,
        part11,
        part12,
        part13,
        part14,
        part15,
        part16,
        part17,
        part18,
        part19,
        part20,
        part21,
        part22,
        part23,
        part24,
        part25,
        part26,
        part27,
        part28,
        part29,
        part30
    ];
    const convertedArr = [];

    for (let i = 0; i < arr.length; i++) {
        const translatedText = await request(arr[i].join("\n"));
        convertedArr.push((translatedText).split("\n"));
    }

    let translatedArr = [];

    convertedArr.forEach((arr) => translatedArr = translatedArr.concat(arr));

    for (let i = 0; i < result.length; i++) {
        let translatedPart = translatedArr[i];

        if (translatedPart.includes("~")) {
            continue;
        }

        let row = `${translatedArr[i]} Епизод${staticArr[i]}`;

        result[i] = row;
    }

    return result.join("\n");
    
    // return part30.join("\n");

}

async function request(text) {

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|bg&de=vaskoantonov1234@gmail.com`;
    const response = await fetch(url);
    const result = await response.json();
    const translatedFirstPart = result.responseData.translatedText;

    // const translatedText = `${text} - Translated`

    return translatedFirstPart;
}