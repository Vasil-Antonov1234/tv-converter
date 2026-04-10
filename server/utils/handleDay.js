import { days, daysNew } from "../data/tvNames.js";

export function handleDay(tvText) {

    tvText = tvText.replaceAll("Нeделя", "Неделя");

    tvText = tvText.replaceAll("НЕДЕЛЯ", "Неделя");
    tvText = tvText.replaceAll("ПОНЕДЕЛНИК", "Понеделник");
    tvText = tvText.replaceAll("ВТОРНИК", "Вторник");
    tvText = tvText.replaceAll("СРЯДА", "Сряда");
    tvText = tvText.replaceAll("ЧЕТВЪРТЪК", "Четвъртък");
    tvText = tvText.replaceAll("ПЕТЪК", "Петък");
    tvText = tvText.replaceAll("СЪБОТА", "Събота");

    tvText = tvText.replaceAll("неделя", "Неделя");
    tvText = tvText.replaceAll("понеделник", "Понеделник");
    tvText = tvText.replaceAll("вторник", "Вторник");
    tvText = tvText.replaceAll("сряда", "Сряда");
    tvText = tvText.replaceAll("четвъртък", "Четвъртък");
    tvText = tvText.replaceAll("петък", "Петък");
    tvText = tvText.replaceAll("събота", "Събота");

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

export function handleNextWeekTvDates() {
    const result = [];

    const baseDate = new Date();

    const dayOfWeek = daysNew[baseDate.getDay() - 1];
    const day = baseDate.getDate();

    let interval = dayOfWeek === "Понеделник" ? 4 : 3;

    for (let i = 0; i < 7; i++) {

        baseDate.setDate(day + interval);
        const startDayOfWeek = daysNew[baseDate.getDay()];
        const startDay = baseDate.getDate();
        const startMonth = baseDate.getMonth() + 1;
        const startYear = baseDate.getFullYear();

        const convertedDate = `${startDayOfWeek} ${String(startDay).padStart(2, 0)}.${String(startMonth).padStart(2, 0)}.${startYear}`;
        result.push(convertedDate);

        interval++;
    }

    return result;
}