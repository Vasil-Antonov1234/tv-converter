export function nedelnikIssueHandler() {
    const today = new Date();
    let baseDate = new Date(today);
    baseDate.setDate(baseDate.getDate() + 1);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() > 9 ? baseDate.getMonth() + 1: `0${baseDate.getMonth() + 1}`;
    const day = baseDate.getDate() > 9 ? baseDate.getDate() : `0${baseDate.getDate()}`;

    const result = `${year}-${month}-${day}`;
    return result;
}
