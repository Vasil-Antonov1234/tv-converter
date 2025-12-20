function archive() {
    const prompt = require("prompt-sync")();

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    let inputDate = prompt("Enter the date in the following format 'day month year': ");
    let [days, month, year] = inputDate.split(" ");
    inputDate = `${month} ${days} ${year}`;

    
    let pattern = /\b(0|1)(\d) [0-3][0-9] \d{4}\b/;
    let match = inputDate.match(pattern);

    if (!match) {
        return "Wrong input!";
    }

    
    if (month < 1 || month > 12 || days < 1 || days > 31) {
        return "Wrong input!";
    }

    const firstIssue = new Date("11 25 2002");
    let firstIssueMilissec = Date.parse(firstIssue);
    let firstIssueDays = Math.round(firstIssueMilissec / day);
    
    let now = Date.now();
    let nowDate = new Date(now);
    let string = nowDate.toDateString();
    let nowDateMillisec = Date.parse(string);
    let nowDateDays = Math.round(nowDateMillisec / day);

    let currentIssue = nowDateDays - firstIssueDays - 1062;
    
    let issueDate = new Date(inputDate);
    let issueDateMillisec = Date.parse(issueDate);
    // let dateIssueMillisec1 = new Date(inputDate).getTime();
    let issueDateDays = Math.round(issueDateMillisec / day);


    if (issueDateDays > nowDateDays) {
        return "The input date must be in the past";
    }

    let diff = nowDateDays - issueDateDays;

    let issue = 0;
    let holidays = ["01 01 2020", "01 01 2021", "09 05 2021", "12 25 2021", "12 26 2021", 
                    "12 27 2021", "01 01 2022", "01 02 2022", "04 24 2022", "04 25 2022", 
                    "12 25 2022", "12 26 2022", "12 27 2022", "01 01 2023", "01 02 2023", 
                    "04 16 2023", "04 17 2023", "05 07 2023", "12 24 2023", "12 25 2023", 
                    "12 26 2023", "12 31 2023", "01 01 2024", "05 05 2024", "05 06 2024", 
                    "12 25 2024", "12 26 2024", "01 01 2025", "07 09 2025"];
    let holidaysDays = [];
    let counterHolidays = 0;

    for (let el of holidays) {
        let currentDate = new Date(el);
        let currentDateMillisec = Date.parse(currentDate);
        let currentDateDays = Math.round(currentDateMillisec / day);
        holidaysDays.push(currentDateDays);
    }
    
     if (holidaysDays.includes(issueDateDays)) {
        return "Holiday";
    }

    for (let el of holidaysDays) {

        if (el >= issueDateDays && el <= nowDateDays) {
            counterHolidays++;
        }

    }

    diff -= counterHolidays;
    issue = currentIssue - diff;

    if (issue < 0) {
        issue = 0;
    }
    return `date: ${inputDate} issue number: ${issue}`
}


console.log(archive());
