export function nedelnikIssueHandler() {
    const today = new Date();
    let baseDate = new Date(today);
    baseDate.setDate(baseDate.getDate() + 1);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth().length > 1 ? baseDate.getMonth() : `0${baseDate.getMonth()}`;
    const day = baseDate.getDate().length > 1 ? baseDate.getDate() : `0${baseDate.getDate()}`;

    const result = `${year}-${month}-${day}`;
    return result;
}
