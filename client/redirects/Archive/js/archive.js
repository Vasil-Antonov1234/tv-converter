document.getElementById("button").onclick = function archive() {
    // const prompt = require("prompt-sync")();
    let inputDate = document.getElementById("input-date").value;
    // let arrDate = inputDate.toString().split("-").reverse();
    // let dateDay = arrDate.splice(0, 1);
    // arrDate.splice(1, 0, dateDay[0]);
    // inputDate = arrDate.join(" ");

    if (!inputDate) {
        return;
    };

    // const issueEl = document.getElementById("issue");
    // issueEl.textContent = "";

    // if (outputContainer) {
    //     outputContainer.remove();
    // };


    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const firstIssue = new Date("11 25 2002");
    let firstIssueMilissec = Date.parse(firstIssue);
    let firstIssueDays = Math.round(firstIssueMilissec / day);
    // console.log(inputDate);
    // console.log(firstIssue);


    let now = Date.now();
    let nowDate = new Date(now);
    let string = nowDate.toDateString();
    let nowDateMillisec = Date.parse(string);
    let nowDateDays = Math.round(nowDateMillisec / day);

    let daysFromFirstIssueToNow = nowDateDays - firstIssueDays;

    let issueDate = new Date(inputDate);
    let issueDateMillisec = Date.parse(issueDate);
    // let dateIssueMillisec1 = new Date(inputDate).getTime();
    let issueInputDateDays = Math.round(issueDateMillisec / day);
    // console.log(issueDate);
    // console.log(string);

    const section = document.querySelector(".output-content");

    check()

    if (issueInputDateDays > nowDateDays + 1) {
        
        
        const wrongDateEl = document.createElement("p");
        wrongDateEl.classList.add("date-and-issue");
        wrongDateEl.textContent = "The input date must be in the past!";
        section.appendChild(wrongDateEl);
        // document.getElementById("date-and-issue").textContent = "The input date must be in the past!";
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
        "12 24 2025", "12 25 2025"
    ];
    let holidaysDays = [];
    let counterHolidays = 0;

    for (let el of holidays) {
        let currentDate = new Date(el);
        let currentDateMillisec = Date.parse(currentDate);
        let currentDateDays = Math.round(currentDateMillisec / day);
        holidaysDays.push(currentDateDays);
    }
    // console.log(holidaysDays);
    // console.log(issueInputDateDays);

    if (holidaysDays.includes(issueInputDateDays)) {
        document.getElementById("issue").textContent = `Holiday`;
        return;
    }

    for (let el of holidaysDays) {

        if (el >= issueInputDateDays && el <= nowDateDays) {
            counterHolidays++;
            // console.log(el);
        }

    }

    daysFromFirstIssueToNow -= 1033;
    daysFromFirstIssueToNow -= holidays.length;

    diff -= counterHolidays;
    issue = daysFromFirstIssueToNow - diff - 1;
    // console.log(counterHolidays);
    // console.log(daysFromFirstIssueToNow);

    if (issue < 0) {
        issue = 0;
    }

    
    
    // const section = document.querySelector(".output-content");

    // let currentDiv = section.querySelector("div");

    // if (currentDiv) {
    //     currentDiv.remove();
    // };

    const outputContainer = document.createElement("div");
    outputContainer.classList.add("output-content");


    section.prepend(outputContainer);

    // const issueTxtEl = document.getElementById("date-and-issue");

    const issueTxtEl = document.createElement("p");
    issueTxtEl.classList.add("date-issue");

    const issueEl = document.createElement("h3");
    issueEl.classList.add("issue-number");

    outputContainer.appendChild(issueTxtEl);
    outputContainer.appendChild(issueEl);

    issueTxtEl.textContent = "issue number:";
    issueEl.textContent = ` ${issue}`;
    return;

    function check() {
        // const section = document.querySelector(".output-content");

        let currentDiv = section.querySelector("div");

        if (currentDiv) {
            currentDiv.remove();
        };

        let currentP = section.querySelector("p");

        
        if (currentP) {
            currentP.remove();    
        };
    }
}
