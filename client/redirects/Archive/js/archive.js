document.getElementById("button").onclick = function archive() {
    // const prompt = require("prompt-sync")();
    let inputDate = document.getElementById("input-date").value;
    // let arrDate = inputDate.toString().split("-").reverse();
    // let dateDay = arrDate.splice(0, 1);
    // arrDate.splice(1, 0, dateDay[0]);
    // inputDate = arrDate.join(" ");
    const message = document.getElementById("issue");
    const issueSign = document.getElementById("date-and-issue");
    const error = document.getElementById("error");
    error.style.display = "none";
    message.style.display = "none";
    issueSign.style.display = "none";

    if (!inputDate) {
        return;
    };

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const firstIssue = new Date("11 25 2002");
    let firstIssueMilissec = Date.parse(firstIssue);
    let firstIssueDays = Math.round(firstIssueMilissec / day);

    let now = Date.now();
    let nowDate = new Date(now);
    let string = nowDate.toDateString();
    let nowDateMillisec = Date.parse(string);
    let nowDateDays = Math.round(nowDateMillisec / day);

    let daysFromFirstIssueToNow = nowDateDays - firstIssueDays;

    let issueDate = new Date(inputDate);
    let issueDateMillisec = Date.parse(issueDate);
    let issueInputDateDays = Math.round(issueDateMillisec / day);

    if (issueInputDateDays > nowDateDays + 1) {

        error.style.display = "block";
        return;

    }

    let diff = nowDateDays - issueInputDateDays;

    let issue;
    let holidays = ["01 01 2020", "01 01 2021", "09 05 2021", "12 25 2021", "12 26 2021",
        "12 27 2021", "01 01 2022", "01 02 2022", "04 24 2022", "04 25 2022",
        "12 25 2022", "12 26 2022", "12 27 2022", "01 01 2023", "01 02 2023",
        "04 16 2023", "04 17 2023", "05 07 2023", "12 24 2023", "12 25 2023",
        "12 26 2023", "12 31 2023", "01 01 2024", "05 05 2024", "05 06 2024",
        "12 25 2024", "12 26 2024", "01 01 2025", "04 20 2025", "04 21 2025", "07 09 2025",
        "12 25 2025", "12 26 2025", "01 01 2026", "01 02 2026"
    ];
    let holidaysDays = [];
    let counterHolidays = 0;

    for (let el of holidays) {
        let currentDate = new Date(el);
        let currentDateMillisec = Date.parse(currentDate);
        let currentDateDays = Math.round(currentDateMillisec / day);
        holidaysDays.push(currentDateDays);
    }

    if (holidaysDays.includes(issueInputDateDays)) {

        message.textContent = "Holiday! Try another date.";
        message.style.display = "block";
        return;

    }

    for (let el of holidaysDays) {

        if (el >= issueInputDateDays && el <= nowDateDays) {
            counterHolidays++;
        };

    };

    daysFromFirstIssueToNow -= 1033;
    daysFromFirstIssueToNow -= holidays.length;

    diff -= counterHolidays;
    issue = daysFromFirstIssueToNow - diff - 1;

    if (issue < 0) {
        issue = 0;
    }

    issueSign.style.display = "block";
    message.textContent = `${issue}`;
    message.style.display = "block";

    return;
}
