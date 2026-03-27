import { EOL } from "os";

export default function fixDateDoxcHandler(textTv) {

    const arrTv = textTv.split("\n")
    const regex = / \d\d\d\d, ПОНЕДЕЛНИК| \d\d\d\d, ВТОРНИК| \d\d\d\d, СРЯДА| \d\d\d\d, ЧЕТВЪРТЪК| \d\d\d\d, ПЕТЪК| \d\d\d\d, СЪБОТА| \d\d\d\d, НЕДЕЛЯ/;
    const regexType1 = /\d\d\d\d-\d\d-\d\d/gm//;

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

    const weekDays = {
        0: "Неделя",
        1: "Понеделник",
        2: "Вторник",
        3: "Сряда",
        4: "Четвъртък",
        5: "Петък",
        6: "Събота"
    }

    for (let i = 0; i < arrTv.length; i++) {
        const row = arrTv[i];
        const match = row.match(regex);

        if (match && (
            row.endsWith("ПОНЕДЕЛНИК") ||
            row.endsWith("ВТОРНИК") ||
            row.endsWith("СРЯДА") ||
            row.endsWith("ЧЕТВЪРТЪК") ||
            row.endsWith("ПЕТЪК") ||
            row.endsWith("СЪБОТА") ||
            row.endsWith("НЕДЕЛЯ")
        )) {
            console.log("case1")
            const tokens = row.split(" ");
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

        if (row.match(regexType1)) {
            const date = new Date(row);

            const year = date.getFullYear();
            let month = String(date.getMonth() + 1);
            let day = String(date.getDate());
            const weekDay = weekDays[date.getDay()]

            if (month.length === 1) {
                month = `0${month}`
            }


            if (day.length === 1) {
                day = `0${day}`
            }

            const fullDate = `${weekDay} ${day}.${month}.${year}`;
            arrTv[i] = `${EOL}${fullDate}${EOL}`
        }

    }

    let convertedArrTv = arrTv.filter((x) => x != "");

    return convertedArrTv;
}
