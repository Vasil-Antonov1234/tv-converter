export default function fixDateDoxcHandler(textTv) {

    const arrTv = textTv.split("\n")
    const regex = / \d\d\d\d, ПОНЕДЕЛНИК| \d\d\d\d, ВТОРНИК| \d\d\d\d, СРЯДА| \d\d\d\d, ЧЕТВЪРТЪК| \d\d\d\d, ПЕТЪК| \d\d\d\d, СЪБОТА| \d\d\d\d, НЕДЕЛЯ/;
    const months = {
        "ЯНУАРИ": 1,
        "ФЕВРУАРИ": 2,
        "МАРТ": 3,
        "АПРИЛ": 4,
        "МАЙ": 5,
        "ЮНИ": 6,
        "ЮЛИ": 7,
        "АВГУСТ": 8,
        "СЕПТЕМВРИ": 9,
        "ОКТОМВРИ": 10,
        "НОЕМВРИ": 11,
        "ДЕКЕМВРИ": 12
    }

    for (let i = 0; i < arrTv.length; i++) {
        const el = arrTv[i];
        const match = el.match(regex);

        if (match && (
            el.endsWith("ПОНЕДЕЛНИК") ||
            el.endsWith("ВТОРНИК") ||
            el.endsWith("СРЯДА") ||
            el.endsWith("ЧЕТВЪРТЪК") ||
            el.endsWith("ПЕТЪК") ||
            el.endsWith("СЪБОТА") ||
            el.endsWith("НЕДЕЛЯ")
        )) {
            const tokens = el.split(" ");
            let day = tokens[3].toLowerCase();
            let firstLetter = day[0].toUpperCase();
            const dayArr = day.split("");
            dayArr.splice(0, 1, firstLetter);
            day = dayArr.join("");
            tokens.pop()
            tokens.unshift(day);

            const month = tokens[2];
            let convertedMonth = months[month];
            convertedMonth = convertedMonth.length > 1 ? convertedMonth : `0${convertedMonth}`;
            tokens.splice(2, 1, convertedMonth);
            const dayText = tokens.shift();
            let convertedDay = tokens[0];
            convertedDay = convertedDay.length > 1 ? convertedDay : `0${convertedDay}`;            
            tokens.splice(0, 1, convertedDay);
            let result = tokens.join(".").replace(",", "");
            result = `${dayText} ${result}`;

            arrTv.splice(i, 1, result)
        }

    }

    const convertedTvText = arrTv.filter((x) => x != "");

    return convertedTvText.join("\n");
}
