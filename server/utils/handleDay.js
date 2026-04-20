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

export function handleNextWeekTvDates(startDate, finalDate) {
    const result = [];

    if (!startDate || !finalDate) {

        const baseDate = new Date();

        const dayOfWeek = daysNew[baseDate.getDay()];
        let day = baseDate.getDate();

        let interval = dayOfWeek === "Понеделник" ? 7 : 6;

        for (let i = 0; i < 7; i++) {

            if (baseDate.getDate() === 1) {
                interval = 1;
                day = 1;
            };

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
    };

    const date1 = new Date(startDate);
    const date2 = new Date(finalDate);

    
    while(date1 <= date2) {
        const dayOfWeek = daysNew[date1.getDay()];
        const day = date1.getDate();
        const month = date1.getMonth() + 1;
        const year = date1.getFullYear();
    
        const convertedDate = `${dayOfWeek} ${String(day).padStart(2, 0)}.${String(month).padStart(2, 0)}.${year}`;
        result.push(convertedDate);
        
        date1.setDate(day + 1);
    }

    return result;
}