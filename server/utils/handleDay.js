export function handleDay(tvText) {

    tvText = tvText.replaceAll("НЕДЕЛЯ", "Неделя");
    tvText = tvText.replaceAll("ПОНЕДЕЛНИК", "Понеделник");
    tvText = tvText.replaceAll("ВТОРНИК", "Вторник");
    tvText = tvText.replaceAll("СРЯДА", "Сряда");
    tvText = tvText.replaceAll("ЧЕТВЪРТЪК", "Четвъртък");
    tvText = tvText.replaceAll("ПЕТЪК", "Петък");
    tvText = tvText.replaceAll("СЪБОТА", "Събота");

    tvText = tvText.replaceAll("Неделя,", "Неделя");
    tvText = tvText.replaceAll("Понеделник,", "Понеделник");
    tvText = tvText.replaceAll("Вторник,", "Вторник");
    tvText = tvText.replaceAll("Сряда,", "Сряда");
    tvText = tvText.replaceAll("Четвъртък,", "Четвъртък");
    tvText = tvText.replaceAll("Петък,", "Петък");
    tvText = tvText.replaceAll("Събота,", "Събота");

    tvText = tvText.replaceAll("Нeделя", "Неделя");

    return tvText;
}

export function handleOutputDay(day) {
    let result = "Error"

    switch (day) {
        case "Понеделник": result = "1-Понеделник";
            break;
        case "Вторник": result = "2-Вторник";
            break;
        case "Сряда": result = "3-Сряда";
            break;
        case "Четвъртък": result = "4-Четвъртък";
            break;
        case "Петък": result = "5-Петък";
            break;
        case "Събота": result = "6-Събота";
            break;
        case "Неделя": result = "7-Неделя";
            break;
        default: result = "Day-misspell!"
    }

    return result;
}
