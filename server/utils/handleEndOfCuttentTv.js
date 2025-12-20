export function handleEndOfCurrentTv(row) {
    let result = false;

    if (row.startsWith("Понеделник") ||
        row.startsWith("Вторник") ||
        row.startsWith("Сряда") ||
        row.startsWith("Четвъртък") ||
        row.startsWith("Петък") ||
        row.startsWith("Събота") ||
        row.startsWith("Неделя") ||
        row.startsWith("Нeделя") 
    ) {

        result = true;
    }

    return result;

}
