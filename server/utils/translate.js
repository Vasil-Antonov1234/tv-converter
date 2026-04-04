export async function translate(tv) {
    let result = tv.split("\n");

    for (let i = 0; i < result.length; i++) {
        let row = result[i];

        if (!row.includes("Episode")) {
            continue;
        };

        row = row.replaceAll("Episode", "Епизод");
        let tokens = row.split("Епизод")
        const firstPart = tokens[0];

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(firstPart)}&langpair=en|bg`;
        const response = await fetch(url);
        const data = await response.json();
        const translatedFirstPart = data.responseData.translatedText;

        tokens.splice(0, 1, translatedFirstPart);

        row = tokens.join(" Епизод");

        result[i] = row;
    };

    return result.join("\n");
}