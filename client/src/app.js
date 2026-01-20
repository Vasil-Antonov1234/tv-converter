const body = document.querySelector("body");
const root = document.getElementById("root");
const paperTemplate = document.getElementById("main-container");
document.querySelector("#main-form").addEventListener("submit", onConvert);
const inputEl = document.querySelector(".tvText");
const outputEl = document.getElementById("outputArea");
// const calcArea = document.getElementById("calcArea");
document.getElementById("calcBtn").addEventListener("click", onCalc);
document.getElementById("resetInput").addEventListener("click", onResetInput);
document.getElementById("resetOutput").addEventListener("click", onResetOtput);
document.getElementById("resetCalc").addEventListener("click", onResetCalc);
document.getElementById("resetAll").addEventListener("click", onResetAll);
const radioContainerElement = document.querySelector(".radio-container");
const spanNotify = document.querySelector(".notify");
const spanClose = document.querySelector(".close");
spanClose.addEventListener("click", closeNotification);
document.getElementById("paper-view").addEventListener("click", tvPaperView);
document.getElementById("tv-book-view").addEventListener("click", tvBookView);
document.getElementById("tv-weather-view").addEventListener("click", weatherView);
document.getElementById("others-view").addEventListener("click", onOthersView);
const dateEl = document.querySelector("#date p");
const dateContainer = document.getElementById("date");
const getFileElement = document.getElementById("listFile");
const selectFileElement = document.getElementById("selectFile");
getFileElement.addEventListener("click", () => selectFileElement.click());
selectFileElement.addEventListener("change", () => addFileContent("inputArea", selectFileElement));
const baseURL = "http://localhost:5000";

const tvCalcConstants = {
    paper: 30,
    book: 31
};

let tvCalcValue = "paper";

let radio;
let isError = false;
let message = "error";

const movies = ["криминален", "документален", "драма", "криминален", "екшън", "приключенски", "ужаси", "комедия",
    "романтичен", "романтика", "фантастика", "трилър", "хорър", "семеен", "уестърн", "мюзикъл", "анимация"];
const episodePattern = /еп. \d+|еп.\d+|епизод \d+|епизод\d+/;
const hourPattern = /\d.\d\d /;

function onConvert(e) {
    e.preventDefault();

    const tvBookOutput = document.querySelectorAll("#tv-book-form textarea")[1];

    isError = false;

    const formData = new FormData(e.currentTarget);
    let input = formData.get("tvText");
    radio = formData.get("tv-radio");

    if (!input) {
        spanNotify.textContent = "There is nothing to convert!";
        spanNotify.style.display = "block";
        spanClose.style.display = "block";
        inputEl.classList.add("radio-container-notify");
        setTimeout(hideNotification, 3000);
        return;
    };

    const allTvNames = {
    "БНТ 1": "bnt1",
    "bTV": "btv",
    "NOVA TV": "novaTv",
    "NOVA NEWS": "novaNews",
    "БНТ 2": "bnt2",
    "БНТ 4": "bnt4",
    "skat": "skat",
    "Diema family": "diemaFemily",
    "Bulgaria on air": "bulgariaOnAir",
    "bTV action": "btvAction",
    "bTV comedy": "btvComedy",
    "bTV cinema": "btvCinema",
    "bTV Story": "btvStory",
    "Dizi": "dizi",
    "Diema": "diema",
    "KINO NOVA": "kinoNova",
    "БНТ 3": "bnt3",
    "HBO 3": "hbo3",
    "AXN": "axn",
    "Star Channel": "starChanel",
    "Star Life": "starLife",
    "Star Crime": "starCrime",
    "HBO": "hbo",
    "HBO 2": "hbo2",
    "Cinemax": "cinemax",
    "Viasat Kino (TV 1000)": "viasatKino",
    "Cinemax 2": "cinemax2",
    "Discovery": "discovery",
    "National G": "nationalG",
    "NG wild": "ngWild",
    "Viasat Nature": "viasatNature",
    "Epic Drama": "epicDrama",
    "Viasat Explorer": "viasatExplorer",
    "Viasat History": "viasatHistory",
    "History": "history",
    "24kitchen": "kitchen24",
    "Diema sport": "diemaSport",
    "Diema sport2": "diemaSport2",
    "Diema sport3": "diemaSport3",
    "Nova sport": "novaSport",
    "Ring": "ring",
    "Eurosport": "eurosport",
    "Eurosport 2": "eurosport2",
    "Max Sport 1": "maxSport1",
    "Max Sport 2": "maxSport2",
    "Max Sport 3": "maxSport3",
    "Max Sport 4": "maxSport4"
}

    // if (typeof (radio) === "object") {
    //     radioContainerElement.classList.add("radio-container-notify");
    //     message = "Please select the day";
    //     spanNotify.textContent = message;
    //     spanNotify.style.display = "block";
    //     spanClose.style.display = "inline";

    //     setTimeout(hideNotification, 3000);
    //     return;
    // };

    const rows = {
        bnt1: {
            "week": 30,
            "saturday": 26,
            "sunday": 23,
            "tvBook": 38
        },
        bnt2: {
            "tvBook": 39
        },
        bnt4: {
            "tvBook": 39
        },
        skat: {
            "tvBook": 28
        },
        diemaFemily: {
            "tvBook": 28
        },
        bulgariaOnAir: {
            "tvBook": 34
        },
        btv: {
            "week": 30,
            "saturday": 20,
            "sunday": 23,
            "tvBook": 39
        },
        novaTv: {
            "week": 30,
            "saturday": 30,
            "sunday": 23,
            "tvBook": 39
        },
        novaNews: {
            "week": 30,
            "saturday": 32,
            "sunday": 23,
            "tvBook": 39
        },
        kinoNova: {
            "week": 22,
            "saturday": 18,
            "sunday": 17,
            "tvBook": 23
        },
        diema: {
            "week": 22,
            "saturday": 18,
            "sunday": 17,
            "tvBook": 23
        },
        hbo3: {
            "tvBook": 23
        },
        axn: {
            "week": 22,
            "saturday": 18,
            "sunday": 17,
            "tvBook": 38
        },
        hbo: {
            "week": 20,
            "saturday": 18,
            "sunday": 19,
            "tvBook": 30
        },
        btvComedy: {
            "week": 17,
            "saturday": 21,
            "sunday": 15,
            "tvBook": 29
        },
        btvAction: {
            "week": 18,
            "saturday": 24,
            "sunday": 17,
            "tvBook": 29
        },
        btvCinema: {
            "week": 19,
            "saturday": 24,
            "sunday": 15,
            "tvBook": 23
        },
        btvStory: {
            "tvBook": 23
        },
        dizi: {
            "tvBook": 23
        },
        ring: {
            "week": 23,
            "saturday": 20,
            "sunday": 14,
            "tvBook": 23
        },
        starLife: {
            "week": 23,
            "saturday": 19,
            "sunday": 17,
            "tvBook": 24
        },
        viasatKino: {
            "week": 23,
            "saturday": 19,
            "sunday": 17,
            "tvBook": 28
        },
        cinemax2: {
            "tvBook": 31
        },
        cinemax: {
            "week": 21,
            "saturday": 23,
            "sunday": 21,
            "tvBook": 39
        },
        starChanel: {
            "week": 21,
            "saturday": 19,
            "sunday": 19,
            "tvBook": 26
        },
        starCrime: {
            "week": 21,
            "saturday": 19,
            "sunday": 19,
            "tvBook": 28
        },
        hbo2: {
            "tvBook": 31
        },
        bnt3: {
            "tvBook": 28
        },
        nationalG: {
            "tvBook": 40
        },
        ngWild: {
            "tvBook": 30
        },
        viasatNature: {
            "tvBook": 36
        },
        epicDrama: {
            "tvBook": 36
        },
        discovery: {
            "tvBook": 17
        },
        viasatExplorer: {
            "tvBook": 44
        },
        history: {
            "tvBook": 54
        },
        kitchen24: {
            "tvBook": 54
        },
        diemaSport: {
            "tvBook": 33
        },
        diemaSport2: {
            "tvBook": 30
        },
        diemaSport3: {
            "tvBook": 27
        },
        novaSport: {
            "tvBook": 31
        },
        eurosport: {
            "tvBook": 24
        },
        eurosport2: {
            "tvBook": 25
        },
        maxSport1: {
            "tvBook": 10
        },
        maxSport2: {
            "tvBook": 25
        },
        maxSport3: {
            "tvBook": 21
        },
        maxSport4: {
            "tvBook": 25
        }
    }

    input = input.replaceAll("\x1F", "");
    input = input.replaceAll("~", "");

    let tvArr = input.split("\n");
    const matchArr = tvArr[1];

    const separatedTv = separateTv(tvArr, allTvNames);

    // console.log(separatedTv);

    const weekMatch = (matchArr && (matchArr.includes("Понеделник") || matchArr.includes("Вторник")
        || matchArr.includes("Сряда") || matchArr.includes("Четвъртък")
        || matchArr.includes("Петък")));

    const saturdayMatch = (matchArr && (matchArr.includes("Събота")));
    const sundayMatch = (matchArr && (matchArr.includes("Неделя")));

    if (!weekMatch && !saturdayMatch && !sundayMatch) {
        isError = true;
    }
    // debugger

    // (isError && typeof (radio) === "string")
    if (isError && radio === "nothing") {
        message = "Wrong input format!";

        spanNotify.textContent = message;
        spanNotify.style.display = "block";
        spanClose.style.display = "inline";
        inputEl.classList.add("radio-container-notify")

        setTimeout(hideNotificationInput, 3000);
        return;
    };

    // const weekMatch = (matchArr.includes("Понеделник") && radio === "week" || matchArr.includes("Вторник") && radio === "week"
    //     || matchArr.includes("Сряда") && radio === "week" || matchArr.includes("Четвъртък") && radio === "week"
    //     || matchArr.includes("Петък") && radio === "week");

    const isMatch = isMatchHandler(radio, weekMatch, saturdayMatch, sundayMatch);

    // if (!weekMatch && !saturdayMatch && !sundayMatch && radio !== "tvBook") {
    //     const choice = confirm("The day doesn't match! Ary you sure you want to continue?");

    //     if (!choice) {
    //         return;
    //     };
    // };

    if (!isMatch) {
        const choice = confirm("The day doesn't match! Ary you sure you want to continue?");

        if (!choice) {
            return;
        };
    };

    let daySelection = daySelectionHandler(radio, weekMatch, saturdayMatch, sundayMatch);

    function daySelectionHandler(radio, weekMatch, saturdayMatch, sundayMatch) {
        if (radio === "nothing" && weekMatch) {
            return "week";
        };

        if (radio === "nothing" && saturdayMatch) {
            return "saturday";
        };

        if (radio === "nothing" && sundayMatch) {
            return "sunday";
        };

        return radio;
    };

    separatedTv.bnt1 = replaceTextForce(separatedTv.bnt1, "документален", "док.");
    separatedTv.bnt1 = deleteByHours(separatedTv.bnt1, rows.bnt1[daySelection], ["00", "01", "02", "03", "04"]);
    separatedTv.bnt1 = convertAll(separatedTv.bnt1, rows.bnt1[daySelection], tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteGenre(separatedTv.bnt1, rows.bnt1[daySelection]);
    separatedTv.bnt1 = deleteIncluding(separatedTv.bnt1, rows.bnt1[daySelection], "/избрано/");
    separatedTv.bnt1 = deleteByHourAndTextExcluding(separatedTv.bnt1, rows.bnt1[daySelection], ["05", "06"], "Денят започва", "сутрешен блок");
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[daySelection], "пряко", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[daySelection], "токшоу", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[daySelection], "куиз шоу", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteIncluding(separatedTv.bnt1, rows.bnt1[daySelection], "режисьор", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteByHourAndTextExcluding(separatedTv.bnt1, rows.bnt1[daySelection], ["07"], "Денят започва", "сутрешен блок");
    separatedTv.bnt1 = deleteByHours(separatedTv.bnt1, rows.bnt1[daySelection], ["23"]);
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[daySelection], "Имате среща с ...", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = replaceText(separatedTv.bnt1, rows.bnt1[daySelection], "БГ киновечер: ", "");
    separatedTv.bnt1 = deleteEndComma(separatedTv.bnt1);
    separatedTv.bnt2 = deleteByHours(separatedTv.bnt2, rows.bnt2[daySelection], ["00", "01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.bnt2 = deleteExcluding(separatedTv.bnt2, rows.bnt2[daySelection], "Лека нощ, деца!", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = deleteGenre(separatedTv.bnt2, rows.bnt2[daySelection]);
    separatedTv.bnt2 = deleteIncluding(separatedTv.bnt2, rows.bnt2[daySelection], "режисьор", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = deleteIncluding(separatedTv.bnt2, rows.bnt2[daySelection], "предаване", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = replaceText(separatedTv.bnt2, rows.bnt2[daySelection], "сериен", "сер.");
    separatedTv.bnt2 = deleteIncluding(separatedTv.bnt2, rows.bnt2[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = deleteEndComma(separatedTv.bnt2);
    separatedTv.bnt3 = deleteByHours(separatedTv.bnt3, rows.bnt3[daySelection], ["01", "02", "03", "04", "05", "06", "00"]);
    separatedTv.bnt3 = deleteIncluding(separatedTv.bnt3, rows.bnt3[daySelection], "режисьор", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt3 = deleteGenre(separatedTv.bnt3, rows.bnt3[daySelection]);
    separatedTv.bnt3 = deleteEndComma(separatedTv.bnt3);
    separatedTv.bnt4 = deleteByHours(separatedTv.bnt4, rows.bnt4[daySelection], ["02", "03", "04"]);
    separatedTv.bnt4 = deleteExcluding(separatedTv.bnt4, rows.bnt4[daySelection], "токшоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = convertAll(separatedTv.btv, rows.btv[daySelection], tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteByHours(separatedTv.btv, rows.btv[daySelection], ["01", "02", "03", "04", "05", "06", "00"]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[daySelection], "токшоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[daySelection], "куиз шоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[daySelection], "забавно шоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[daySelection], "поредица", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[daySelection], "телевизионна игра", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteGenre(separatedTv.btv, rows.btv[daySelection]);
    separatedTv.btv = deletePatternIncluding(separatedTv.btv, rows.btv[daySelection], /с водеща |с водещи |с водещ /);
    separatedTv.btv = deleteEndComma(separatedTv.btv);
    separatedTv.novaTv = deleteByHours(separatedTv.novaTv, rows.novaTv[daySelection], ["01", "02", "03", "04", "05"]);
    separatedTv.novaTv = convertAll(separatedTv.novaTv, rows.novaTv[daySelection], tvCalcConstants[tvCalcValue]);
    separatedTv.novaTv = replaceText(separatedTv.novaTv, rows.novaTv[daySelection], "(премиера)", "");
    separatedTv.novaTv = replaceText(separatedTv.novaTv, rows.novaTv[daySelection], "с уч.", "игрален филм с уч.");
    separatedTv.novaTv = deleteExcluding(separatedTv.novaTv, rows.novaTv[daySelection], "игрален филм", tvCalcConstants[tvCalcValue]);
    separatedTv.novaTv = equalization(separatedTv.novaTv, rows.novaTv[daySelection], "сер.", "сериен телевизионен филм");
    separatedTv.novaNews = convertAll(separatedTv.novaNews, rows.novaNews[daySelection], tvCalcConstants[tvCalcValue]);
    separatedTv.novaNews = deleteByHours(separatedTv.novaNews, rows.novaNews[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "09", "23", "00"]);
    separatedTv.novaNews = deleteByHourAndText(separatedTv.novaNews, rows.novaNews[daySelection], ["11.00", "13.00", "15.00", "16.00", "18.00", "21.00"], "Новините");
    separatedTv.novaNews = deleteExcluding(separatedTv.novaNews, rows.novaNews[daySelection], "поредица", tvCalcConstants[tvCalcValue]);
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[daySelection], "документална поредица", "поредица");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[daySelection], " на DW", "");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[daySelection], "(премиера) ", "");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[daySelection], "икономическо предаване", "предаване");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[daySelection], "публицистично токшоу", "токшоу");
    separatedTv.hbo = deleteIncluding(separatedTv.hbo, rows.hbo[daySelection], "реж.", tvCalcConstants[tvCalcValue]);
    separatedTv.hbo = deleteGenre(separatedTv.hbo, rows.hbo[daySelection]);
    separatedTv.hbo = deleteByHours(separatedTv.hbo, rows.hbo[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.hbo = deleteEndComma(separatedTv.hbo);
    separatedTv.axn = deleteAfterEpisode(separatedTv.axn, rows.axn[daySelection]);
    separatedTv.axn = deleteEndComma(separatedTv.axn);
    separatedTv.axn = deleteByHours(separatedTv.axn, rows.axn[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.axn = replaceTextForce(separatedTv.axn, "сезон", "сер.");
    separatedTv.axn = deleteExcludingForce(separatedTv.axn, rows.axn[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.axn = replaceTextForce(separatedTv.axn, "сер. ", "сезон ");
    separatedTv.axn = deleteRepetedRows1(separatedTv.axn, rows.axn[daySelection]);
    separatedTv.axn = equalization(separatedTv.axn, rows.axn[daySelection], "еп.", "епизод");
    separatedTv.axn = equalization(separatedTv.axn, rows.axn[daySelection], ";", " - ");
    separatedTv.kinoNova = deleteByHours(separatedTv.kinoNova, rows.kinoNova[daySelection], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.kinoNova = deleteGenre(separatedTv.kinoNova, rows.kinoNova[daySelection]);
    separatedTv.kinoNova = deleteEndComma(separatedTv.kinoNova);
    separatedTv.diema = deleteGenre(separatedTv.diema, rows.diema[daySelection]);
    separatedTv.diema = deleteByHours(separatedTv.diema, rows.diema[daySelection], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.diema = deleteEndComma(separatedTv.diema);
    separatedTv.hbo3 = replaceTextForce(separatedTv.hbo3, "„", "");
    separatedTv.hbo3 = replaceTextForce(separatedTv.hbo3, "”", "");
    separatedTv.hbo3 = deleteByHours(separatedTv.hbo3, rows.hbo3[daySelection], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.hbo3 = deleteGenre(separatedTv.hbo3, rows.hbo3[daySelection]);
    separatedTv.hbo3 = deleteEndComma(separatedTv.hbo3);
    separatedTv.hbo3 = deleteExcluding(separatedTv.hbo3, rows.hbo3[daySelection], "еп.", tvCalcConstants[tvCalcValue]);    
    separatedTv.btvAction = deleteGenre(separatedTv.btvAction, rows.btvAction[daySelection]);
    separatedTv.btvAction = deleteByHours(separatedTv.btvAction, rows.btvAction[daySelection], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.btvAction = deleteExcludingForce(separatedTv.btvAction, rows.btvAction[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteRepetedRows(separatedTv.btvAction, rows.btvAction[daySelection]);
    separatedTv.btvAction = deleteExcludingForce(separatedTv.btvAction, rows.btvAction[daySelection], "предаване,", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteSpecific(separatedTv.btvAction, "екстремно");
    separatedTv.btvAction = deleteExcluding(separatedTv.btvAction, rows.btvAction[daySelection], "предаване", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteExcluding(separatedTv.btvAction, rows.btvAction[daySelection], "телевизионна игра", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteEndComma(separatedTv.btvAction);
    separatedTv.btvAction = replaceText(separatedTv.btvAction, rows.btvAction[daySelection], "ПРЕМИЕРА: ", "");
    separatedTv.btvAction = replaceText(separatedTv.btvAction, rows.btvAction[daySelection], "Премиера: ", "");
    separatedTv.btvAction = replaceText(separatedTv.btvAction, rows.btvAction[daySelection], "документална поредица", "поредица");
    separatedTv.btvAction = deleteByHours(separatedTv.btvAction, rows.btvAction[daySelection], ["00", "23"]);
    separatedTv.btvComedy = deleteGenre(separatedTv.btvComedy, rows.btvComedy[daySelection]);
    separatedTv.btvComedy = deleteExcludingForce(separatedTv.btvComedy, rows.btvComedy[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvComedy = deleteExcludingForce(separatedTv.btvComedy, rows.btvComedy[daySelection], "сер.,", tvCalcConstants[tvCalcValue]);
    separatedTv.btvComedy = deleteRepetedRows1(separatedTv.btvComedy, rows.btvComedy[daySelection]);
    separatedTv.btvComedy = replaceTextForce(separatedTv.btvComedy, "Премиера: ", "");
    separatedTv.btvComedy = deleteByHours(separatedTv.btvComedy, rows.btvComedy[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.btvComedy = replaceText(separatedTv.btvComedy, rows.btvComedy[daySelection], "сериал,", "");
    separatedTv.btvCinema = deleteGenre(separatedTv.btvCinema, rows.btvCinema[daySelection]);
    separatedTv.btvCinema = deleteByHours(separatedTv.btvCinema, rows.btvCinema[daySelection], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.btvCinema = deleteExcludingForce(separatedTv.btvCinema, rows.btvCinema[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvCinema = deleteRepetedRows1(separatedTv.btvCinema, rows.btvCinema[daySelection]);
    separatedTv.btvCinema = deleteEndComma(separatedTv.btvCinema);
    separatedTv.dizi = deleteByHours(separatedTv.dizi, rows.dizi[daySelection], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.dizi = deleteGenre(separatedTv.dizi, rows.dizi[daySelection]);
    separatedTv.dizi = replaceText(separatedTv.dizi, rows.dizi[daySelection], "Епизод", "ep.");
    separatedTv.dizi = replacePattern(separatedTv.dizi, rows.dizi[daySelection], /Сезон \d -/, "");
    separatedTv.starLife = deleteByHours(separatedTv.starLife, rows.starLife[daySelection], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.starLife = deleteAfterEpisode(separatedTv.starLife, rows.starLife[daySelection]);
    separatedTv.starLife = deletePatternIncluding(separatedTv.starLife, rows.starLife[daySelection], /еп. \d+/);
    separatedTv.starLife = deleteRepetedRows1(separatedTv.starLife, rows.starLife[daySelection]);
    separatedTv.starLife = deleteEndComma(separatedTv.starLife);
    separatedTv.ring = replaceText(separatedTv.ring, rows.ring[daySelection], "документална поредица", "поредица");
    separatedTv.ring = replaceText(separatedTv.ring, rows.ring[daySelection], "ПРЯКО", "");
    separatedTv.ring = deleteExcluding(separatedTv.ring, rows.ring[daySelection], "обзор", tvCalcConstants[tvCalcValue]);
    separatedTv.ring = deleteByHours(separatedTv.ring, rows.ring[daySelection], ["03", "04", "05", "06"]);
    separatedTv.ring = replaceText(separatedTv.ring, rows.ring[daySelection], " : ", " ");
    separatedTv.cinemax = deleteGenre(separatedTv.cinemax, rows.cinemax[daySelection]);
    separatedTv.cinemax = deleteByHours(separatedTv.cinemax, rows.cinemax[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08"])
    separatedTv.cinemax = deleteEndComma(separatedTv.cinemax);
    separatedTv.viasatKino = replaceTextForce(separatedTv.viasatKino, "/", " ");
    separatedTv.viasatKino = deleteGenre(separatedTv.viasatKino, rows.viasatKino[daySelection]);
    separatedTv.viasatKino = deleteByHours(separatedTv.viasatKino, rows.viasatKino[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "09", "00"]);
    separatedTv.cinemax2 = deletePatternIncluding(separatedTv.cinemax2, rows.cinemax2[daySelection], /, \d\d\d\d;/);
    separatedTv.cinemax2 = deleteAfterEpisode(separatedTv.cinemax2, rows.cinemax2[daySelection]);
    // separatedTv.viasatKino = replaceTextForce(separatedTv.viasatKino, "TV 1000", "Viasat Kino");
    separatedTv.starChanel = replaceTextForce(separatedTv.starChanel, "еп.", "сер.");
    separatedTv.starChanel = deleteExcludingForce(separatedTv.starChanel, rows.starChanel[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    // separatedTv.starChanel = deleteRepetedRows1(separatedTv.starChanel, rows.starChanel[daySelection]);
    separatedTv.starChanel = deleteByHours(separatedTv.starChanel, rows.starChanel[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08"]);
    separatedTv.starCrime = deleteByHours(separatedTv.starCrime, rows.starCrime[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08"]);
    separatedTv.starCrime = replaceTextForce(separatedTv.starCrime, "еп.", "сер.");
    separatedTv.starCrime = deleteRepetedRows1(separatedTv.starCrime, rows.starCrime[daySelection]);
    separatedTv.skat = deleteSpecific(separatedTv.skat, "(повторение)");
    separatedTv.skat = deleteByHours(separatedTv.skat, rows.skat[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.skat = deleteExcluding(separatedTv.skat, rows.skat[daySelection], "Новини", tvCalcConstants[tvCalcValue]);
    separatedTv.skat = replaceText(separatedTv.skat, rows.skat[daySelection], "публицистично", "");
    separatedTv.skat = deleteExcluding(separatedTv.skat, rows.skat[daySelection], "предаване", tvCalcConstants[tvCalcValue]);
    separatedTv.skat = deleteIncluding(separatedTv.skat, rows.skat[daySelection], "-", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaFemily = deleteByHours(separatedTv.diemaFemily, rows.diemaFemily[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.diemaFemily = deleteGenre(separatedTv.diemaFemily, rows.diemaFemily[daySelection]);
    separatedTv.bulgariaOnAir = deleteByHours(separatedTv.bulgariaOnAir, rows.bulgariaOnAir[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.bulgariaOnAir = deleteGenre(separatedTv.bulgariaOnAir, rows.bulgariaOnAir[daySelection]);
    separatedTv.bulgariaOnAir = deleteRow(separatedTv.bulgariaOnAir, rows.bulgariaOnAir[daySelection], "Телепазарен прозорец");
    separatedTv.btvStory = deleteByHours(separatedTv.btvStory, rows.btvStory[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.btvStory = deleteExcluding(separatedTv.btvStory, rows.btvStory[daySelection], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvStory = replaceTextForce(separatedTv.btvStory, "Премиера: ", "");
    separatedTv.btvStory = deleteRepetedRows1(separatedTv.btvStory, rows.btvStory[daySelection]);
    separatedTv.btvStory = deleteGenre(separatedTv.btvStory, rows.btvStory[daySelection]);
    separatedTv.btvStory = replaceText(separatedTv.btvStory, rows.btvStory[daySelection], "сериал,", "")
    
    separatedTv.starChanel = deleteByHours(separatedTv.starChanel, rows.starChanel[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.hbo2 = deleteByHours(separatedTv.hbo2, rows.hbo2[daySelection], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.hbo2 = deletePatternIncluding(separatedTv.hbo2, rows.hbo2[daySelection], /\[\d\d\+\]/);
    separatedTv.hbo2 = deleteGenre(separatedTv.hbo2, rows.hbo2[daySelection]);
    separatedTv.hbo2 = deleteEndComma(separatedTv.hbo2, rows.hbo2[daySelection]);
    separatedTv.discovery = deleteByHours(separatedTv.discovery, rows.discovery[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.discovery = replaceTextForce(separatedTv.discovery, "_==", " ");
    separatedTv.discovery = replaceTextForce(separatedTv.discovery, ":", " -")
    separatedTv.discovery = replaceTextForce(separatedTv.discovery, "(", "")
    separatedTv.discovery = replaceTextForce(separatedTv.discovery, ")", "")
    separatedTv.discovery = deleteIncluding(separatedTv.discovery, rows.discovery[daySelection], "-", tvCalcConstants[tvCalcValue]);
    separatedTv.nationalG = deleteByHours(separatedTv.nationalG, rows.nationalG[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.ngWild = deleteByHours(separatedTv.ngWild, rows.ngWild[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.viasatNature = deleteByHours(separatedTv.viasatNature, rows.viasatNature[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.epicDrama = deleteByHours(separatedTv.epicDrama, rows.epicDrama[daySelection], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.epicDrama = deletePatternIncluding(separatedTv.epicDrama, rows.epicDrama[daySelection], /еп. \d+/);
    separatedTv.viasatExplorer = deleteByHours(separatedTv.viasatExplorer, rows.viasatExplorer[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.history = deleteByHours(separatedTv.history, rows.history[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.kitchen24 = deleteByHours(separatedTv.kitchen24, rows.kitchen24[daySelection], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.kitchen24 = replaceTextForce(separatedTv.kitchen24, "Factual Entertainment ", "");
    separatedTv.kitchen24 = replaceTextForce(separatedTv.kitchen24, "Cooking ", "");
    separatedTv.diemaSport = deleteExcluding(separatedTv.diemaSport, rows.diemaSport[daySelection], "Обзор", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaSport = deleteExcluding(separatedTv.diemaSport, rows.diemaSport[daySelection], "обзор", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaSport = deleteExcluding(separatedTv.diemaSport, rows.diemaSport[daySelection], "efbet Лига", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaSport = deletePatternIncluding(separatedTv.diemaSport, rows.diemaSport[daySelection], /\d{4}\/\d{4}/);
    separatedTv.diemaSport = deletePatternIncluding(separatedTv.diemaSport, rows.diemaSport[daySelection], /\d{2}\.\d{2} Програмна пауза/);
    separatedTv.diemaSport = replaceText(separatedTv.diemaSport, rows.diemaSport[daySelection], "Световното първенство", "СП");
    separatedTv.diemaSport2 = deletePatternIncluding(separatedTv.diemaSport2, rows.diemaSport2[daySelection], /\d{4}\/\d{4}/);
    separatedTv.diemaSport2 = deletePatternIncluding(separatedTv.diemaSport2, rows.diemaSport2[daySelection], /\d{2}\.\d{2} Програмна пауза/);
    separatedTv.diemaSport2 = replaceText(separatedTv.diemaSport2, rows.diemaSport2[daySelection], " /n/", "");
    separatedTv.diemaSport2 = replaceText(separatedTv.diemaSport2, rows.diemaSport2[daySelection], "/n/", "");
    separatedTv.diemaSport2 = replaceText(separatedTv.diemaSport2, rows.diemaSport2[daySelection], "Световното първенство", "СП");
    separatedTv.diemaSport3 = deleteAllExludingSpecific(separatedTv.diemaSport3, rows.diemaSport3[daySelection], "Формула 1");
    separatedTv.diemaSport3 = deleteAllExludingSpecific(separatedTv.diemaSport3, rows.diemaSport3[daySelection], "Формула 2");
    separatedTv.diemaSport3 = deleteAllExludingSpecific(separatedTv.diemaSport3, rows.diemaSport3[daySelection], "Формула 3");
    separatedTv.diemaSport3 = deleteRepetedRows1(separatedTv.diemaSport3, rows.diemaSport3[daySelection]);
    separatedTv.diemaSport3 = replaceText(separatedTv.diemaSport3, rows.diemaSport3[daySelection], " /n/", "");
    separatedTv.diemaSport3 = replaceText(separatedTv.diemaSport3, rows.diemaSport3[daySelection], "/n/", "");
    separatedTv.diemaSport3 = deletePatternIncluding(separatedTv.diemaSport3, rows.diemaSport3[daySelection], /\d{4}\/\d{4}/);
    separatedTv.diemaSport3 = replaceText(separatedTv.diemaSport3, rows.diemaSport3[daySelection], "Световното първенство", "СП");
    separatedTv.novaSport = replaceText(separatedTv.novaSport, rows.novaSport[daySelection], " /n/", "");
    separatedTv.novaSport = replaceText(separatedTv.novaSport, rows.novaSport[daySelection], "/n/", "");
    separatedTv.eurosport = replaceText(separatedTv.eurosport, rows.eurosport[daySelection], ":", " :");
    separatedTv.eurosport = deleteIncluding(separatedTv.eurosport, rows.eurosport[daySelection], ":", tvCalcConstants[tvCalcValue]);
    separatedTv.eurosport = deleteRepetedRows1(separatedTv.eurosport, rows.eurosport[daySelection]);
    separatedTv.eurosport2 = replaceText(separatedTv.eurosport2, rows.eurosport2[daySelection], ":", " :");
    separatedTv.eurosport2 = deleteIncluding(separatedTv.eurosport2, rows.eurosport2[daySelection], ":", tvCalcConstants[tvCalcValue]);
    separatedTv.eurosport2 = deleteRepetedRows1(separatedTv.eurosport2, rows.eurosport2[daySelection]);
    separatedTv.maxSport1 = removeRepeatedPhrases(separatedTv.maxSport1);
    separatedTv.maxSport1 = replaceText(separatedTv.maxSport1, rows.maxSport1[daySelection], "ПРЯКО", "");
    separatedTv.maxSport1 = replaceText(separatedTv.maxSport1, rows.maxSport1[daySelection], " ,", "");
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "ATP 1000", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteRepetedRows1(separatedTv.maxSport1, rows.maxSport1[daySelection]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Moto GP", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Moto 2", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Moto 3", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Moto E", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Nascar Cup Series", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Световен рали шампионат", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[daySelection], "Европейски рали шампионат", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteRepetedRows1(separatedTv.maxSport1, rows.maxSport1[daySelection]);
    separatedTv.maxSport2 = removeRepeatedPhrases(separatedTv.maxSport2);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[daySelection], "Moto GP", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[daySelection], "Moto 2", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[daySelection], "Moto 3", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[daySelection], "Световен рали шампионат", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[daySelection], "UFC Fight Night", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[daySelection], "Nascar Cup Series", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteRepetedRows1(separatedTv.maxSport2, rows.maxSport2[daySelection]);
    separatedTv.maxSport3 = removeRepeatedPhrases(separatedTv.maxSport3);
    separatedTv.maxSport3 = removeRepeatedPhrases(separatedTv.maxSport3);
    separatedTv.maxSport3 = deleteExcluding(separatedTv.maxSport3, rows.maxSport3[daySelection], "Moto GP", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport3 = deleteExcluding(separatedTv.maxSport3, rows.maxSport3[daySelection], "Moto 2", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport3 = deleteExcluding(separatedTv.maxSport3, rows.maxSport3[daySelection], "Moto 3", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport3 = deleteRepetedRows1(separatedTv.maxSport3, rows.maxSport3[daySelection]);
    separatedTv.maxSport4 = removeRepeatedPhrases(separatedTv.maxSport4);
    separatedTv.maxSport4 = replaceText(separatedTv.maxSport4, rows.maxSport4[daySelection], "ПРЯКО", "");
    separatedTv.maxSport4 = replaceText(separatedTv.maxSport4, rows.maxSport4[daySelection], " ,", " ");
    separatedTv.maxSport4 = deleteRow(separatedTv.maxSport4, rows.maxSport4[daySelection], 'Студио "Футбол"');

    let output = "";
    const selectionChoice = selectionChoiceHandler(radio, weekMatch, saturdayMatch, sundayMatch);

    if (selectionChoice === "week") {
        output = separatedTv.bnt1.join("\n") + "\n\n"
            + separatedTv.btv.join("\n") + "\n\n"
            + separatedTv.novaTv.join("\n") + "\n\n"
            + separatedTv.novaNews.join("\n") + "\n\n"
            + separatedTv.hbo.join("\n") + "\n\n"
            + separatedTv.axn.join("\n") + "\n\n"
            + separatedTv.kinoNova.join("\n") + "\n\n"
            + separatedTv.diema.join("\n") + "\n\n"
            + separatedTv.btvAction.join("\n") + "\n\n"
            + separatedTv.btvComedy.join("\n") + "\n\n"
            + separatedTv.btvCinema.join("\n") + "\n\n"
            + separatedTv.starLife.join("\n") + "\n\n"
            + separatedTv.viasatKino.join("\n") + "\n\n"
            + separatedTv.ring.join("\n") + "\n\n";

        outputEl.value = output.trim();
    } else if (selectionChoice === "saturday") {
        output = separatedTv.bnt1.join("\n") + "\n\n"
            + separatedTv.btv.join("\n") + "\n\n"
            + separatedTv.novaTv.join("\n") + "\n\n"
            + separatedTv.cinemax.join("\n") + "\n\n"
            + separatedTv.kinoNova.join("\n") + "\n\n"
            + separatedTv.diema.join("\n") + "\n\n"
            + separatedTv.axn.join("\n") + "\n\n"
            + separatedTv.hbo.join("\n") + "\n\n"
            + separatedTv.viasatKino.join("\n") + "\n\n"
            + separatedTv.starChanel.join("\n") + "\n\n"
            + separatedTv.starLife.join("\n") + "\n\n"
            + separatedTv.starCrime.join("\n") + "\n\n"
            + separatedTv.novaNews.join("\n") + "\n\n"
            + separatedTv.btvAction.join("\n") + "\n\n"
            + separatedTv.btvComedy.join("\n") + "\n\n"
            + separatedTv.btvCinema.join("\n") + "\n\n";

        outputEl.value = output.trim();
    } else if (selectionChoice === "sunday") {
        output = separatedTv.bnt1.join("\n") + "\n\n"
            + separatedTv.btv.join("\n") + "\n\n"
            + separatedTv.novaTv.join("\n") + "\n\n"
            + separatedTv.novaNews.join("\n") + "\n\n"
            + separatedTv.hbo.join("\n") + "\n\n"
            + separatedTv.axn.join("\n") + "\n\n"
            + separatedTv.kinoNova.join("\n") + "\n\n"
            + separatedTv.diema.join("\n") + "\n\n"
            + separatedTv.btvAction.join("\n") + "\n\n"
            + separatedTv.btvComedy.join("\n") + "\n\n"
            + separatedTv.btvCinema.join("\n") + "\n\n"
            + separatedTv.starLife.join("\n") + "\n\n"
            + separatedTv.viasatKino.join("\n") + "\n\n"
            + separatedTv.ring.join("\n") + "\n\n";

        outputEl.value = output.trim();
    } else if (selectionChoice === "tvBook") {
        output = separatedTv.bnt1.join("\n") + "\n\n"
            + separatedTv.btv.join("\n") + "\n\n"
            + separatedTv.novaTv.join("\n") + "\n\n"
            + separatedTv.novaNews.join("\n") + "\n\n"
            + separatedTv.bnt2.join("\n") + "\n\n"
            + separatedTv.bnt4.join("\n") + "\n\n"
            + separatedTv.skat.join("\n") + "\n\n"
            + separatedTv.diemaFemily.join("\n") + "\n\n"
            + separatedTv.bulgariaOnAir.join("\n") + "\n\n"
            + separatedTv.btvAction.join("\n") + "\n\n"
            + separatedTv.btvComedy.join("\n") + "\n\n"
            + separatedTv.btvCinema.join("\n") + "\n\n"
            + separatedTv.btvStory.join("\n") + "\n\n"
            + separatedTv.dizi.join("\n") + "\n\n"
            + separatedTv.kinoNova.join("\n") + "\n\n"
            + separatedTv.diema.join("\n") + "\n\n"
            + separatedTv.hbo3.join("\n") + "\n\n"
            + separatedTv.axn.join("\n") + "\n\n"
            + separatedTv.starChanel.join("\n") + "\n\n"
            + separatedTv.starLife.join("\n") + "\n\n"
            + separatedTv.starCrime.join("\n") + "\n\n"
            + separatedTv.hbo.join("\n") + "\n\n"
            + separatedTv.hbo2.join("\n") + "\n\n"
            + separatedTv.cinemax.join("\n") + "\n\n"
            + separatedTv.viasatKino.join("\n") + "\n\n"
            + separatedTv.cinemax2.join("\n") + "\n\n"
            + separatedTv.nationalG.join("\n") + "\n\n"
            + separatedTv.ngWild.join("\n") + "\n\n"
            + separatedTv.viasatNature.join("\n") + "\n\n"
            + separatedTv.bnt3.join("\n") + "\n\n"
            + separatedTv.epicDrama.join("\n") + "\n\n"
            + separatedTv.discovery.join("\n") + "\n\n"
            + separatedTv.viasatExplorer.join("\n") + "\n\n"
            + separatedTv.history.join("\n") + "\n\n"
            + separatedTv.kitchen24.join("\n") + "\n\n"
            + separatedTv.diemaSport.join("\n") + "\n\n"
            + separatedTv.diemaSport2.join("\n") + "\n\n"
            + separatedTv.diemaSport3.join("\n") + "\n\n"
            + separatedTv.novaSport.join("\n") + "\n\n"
            + separatedTv.ring.join("\n") + "\n\n"
            + separatedTv.eurosport.join("\n") + "\n\n"
            + separatedTv.eurosport2.join("\n") + "\n\n"
            + separatedTv.maxSport1.join("\n") + "\n\n"
            + separatedTv.maxSport2.join("\n") + "\n\n"
            + separatedTv.maxSport3.join("\n") + "\n\n"
            + separatedTv.maxSport4.join("\n") + "\n\n";

        tvBookOutput.value = output.trim();
    };

    const outputBook = document.getElementById("inputBookArea");
    const dateElBook = document.querySelector("#dateBook p");
    const dateElBookContainer = document.getElementById("dateBook");

    if (outputBook) {
        outputBook.value = "";
    };

    const isCorrectDayInput = isCorrectDayInputHandler(matchArr);

    if (dateElBookContainer) {
        dateElBookContainer.style.display = "inline";

        if (isCorrectDayInput) {
            dateElBook.textContent = matchArr;
        };

        if (!isCorrectDayInput) {
            dateElBook.textContent = "Day: undefined!"
        };
    }

    if (isCorrectDayInput) {
        dateEl.textContent = matchArr;
    };

    if (!isCorrectDayInput) {
        dateEl.textContent = "Day: undefined!"
    };

    dateContainer.style.display = "inline";
}

function onCalc() {
    let calcArea = undefined;
    let calcChars = undefined;
    let calcRows = undefined;


    if (!calcArea) {
        calcArea = document.getElementById("calcAreaBook");
        calcChars = document.getElementById("calcCharsTvBook");
        calcRows = document.getElementById("calcRowsTvBook");
    };

    if (!calcArea) {
        calcArea = document.getElementById("calcArea");
        calcChars = document.getElementById("calcChars");
        calcRows = document.getElementById("calcRows");
    };

    let input = calcArea.value;
    input = input.replaceAll("\x1F", "");
    // debugger
    const rows = calcReturnsCount1(input.split("\n"), tvCalcConstants[tvCalcValue]);
    calcChars.textContent = `Characters count: ${input.length}`;
    calcRows.textContent = `Rows count: ${rows}`;
};


function onResetAll() {
    document.getElementById("inputArea").value = "";
    document.getElementById("outputArea").value = "";
    document.getElementById("calcArea").value = "";
    dateContainer.style.display = "none";
};

function onResetInput() {
    document.getElementById("inputArea").value = "";
};

function onResetOtput() {
    document.getElementById("outputArea").value = "";
    dateContainer.style.display = "none";
};

function onResetCalc() {

    let textArea = undefined;

    if (!textArea) {
        textArea = document.getElementById("calcArea");
    };

    if (!textArea) {
        textArea = document.getElementById("calcAreaBook");
    };

    textArea.value = "";
};


function deleteByHourAndText(arr, rows, hours, text) {
    const result = arr;
    let returnsCount = calcReturnsCount1(arr, tvCalcConstants[tvCalcValue]);


    if (returnsCount > rows) {
        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            let rowArr = row.split(" ");

            if (returnsCount > rows) {
                let hour = rowArr[0];

                if (hours.includes(hour) && rowArr[1] === text) {
                    result.splice(i, 1);
                    i--;
                    returnsCount = calcReturnsCount1(arr, tvCalcConstants[tvCalcValue]);
                }
            } else {
                break;
            }
        }
    }

    return result;
}

function deleteByHourAndTextExcluding(arr, rows, hours, text, text2, text3) {
    const result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);


    if (returnsCount > rows) {
        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            let rowArr = row.split(" ");

            if (returnsCount > rows) {
                let hour = rowArr.shift();
                const rest = rowArr.join(" ");
                const isIncludes = rest.includes(text) || rest.includes(text2) || rest.includes(text3);
                let isHour = false;

                hours.forEach((x) => {
                    if (hour.startsWith(x)) {
                        isHour = true;
                    };
                });

                if (isHour && !isIncludes) {
                    result.splice(i, 1);
                    i--;
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                }
            } else {
                break;
            }
        }
    }

    return result;
}

function replaceText(arr, rows, text, newText) {
    let result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {

            if (returnsCount > rows) {
                let row = result[i];
                row = row.replaceAll(text, newText);
                row = row.replaceAll("  ", " ");
                result.splice(i, 1, row);
                returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
            } else {
                break;
            }
        };
    };

    return result;
}

function replacePattern(arr, rows, pattern, newText) {
        
    let result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {

            let row = result[i];
            const match = row.match(pattern)

            if (match) {
                row = row.split(match).join("")
                result.splice(i, 1, row);
                returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue])
            }

            if (returnsCount <= rows) {
                break;
            };
        };
    };

    return result;
}

function replaceTextForce(arr, text, newText) {
    let result = [];

    for (let row of arr) {
        row = row.replace(text, newText);
        row = row.replace("  ", " ");
        result.push(row);
    };

    return result;
}

function deleteSpecific(arr, text) {
    let result = [];
    for (let row of arr) {
        row = row.replace(text, "");
        row = row.replace("  ", " ");
        result.push(row);
    };

    return result;
}


function deleteRepetedRows(arr, rows) {
    let result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    // debugger
    if (returnsCount > rows) {
        let el1 = "";
        let el2 = "";

        for (i = 0; i < result.length; i++) {
            let row = result[i];

            let rowArr = row.split('"');

            if (!el1) {
                el1 = rowArr[1];
                continue;
            };

            if (el1) {
                el2 = rowArr[1];
            };

            if (el1 && el2) {

                if (el1 === el2) {
                    result.splice(i, 1);
                    el2 = "";
                    i--;
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                } else {
                    el1 = el2;
                    el2 = "";
                }
            }
        }
    }

    return result;
}

function deleteRepetedRows1(arr, rows) {
    let result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    // debugger
    if (returnsCount > rows) {
        let el1 = "";
        let el2 = "";

        for (i = 0; i < result.length; i++) {

            if (returnsCount <= rows) {
                break;
            }

            let row = result[i];

            let match = row.match(hourPattern);

            let rowArr = row.split(match);

            if (!el1) {
                el1 = rowArr[1];
                continue;
            };

            if (el1) {
                el2 = rowArr[1];
            };

            if (el1 && el2) {

                if (el1 === el2) {
                    result.splice(i, 1);
                    el2 = "";
                    i--;
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                } else {
                    el1 = el2;
                    el2 = "";
                }
            }
        }
    }

    return result;
}

function deleteEndComma(arr) {
    const result = []

    for (let row of arr) {
        result.push(removeComma(row))
    };

    return result;
}


function deleteGenre(arr, rows) {
    const result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);


    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            let rowArr = row.split(" ");

            if (returnsCount > rows) {

                for (let j = 0; j < rowArr.length; j++) {
                    let word = rowArr[j];
                    word = word.replace(",", "");

                    if (movies.includes(word)) {
                        rowArr.splice(j + 1, rowArr.length - 1);
                        result.splice(i, 1, rowArr.join(" "));
                        returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                        break;
                    };
                };

            } else {
                break;
            };

        };

    }

    return result;
}

function deleteAfterEpisode(arr, rows) {
    const result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);


    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            const match = row.match(episodePattern);

            if (match) {
                let rowArr = row.split(match);
                row = rowArr[0] + " " + match;
                result.splice(i, 1, row);
                returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
            };

            if (returnsCount <= rows) {
                break;
            };
        };

    };

    return result;
};


function deletePatternIncluding(arr, rows, pattern) {
    const result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            const match = row.match(pattern);

            if (match) {
                let rowArr = row.split(match);
                row = rowArr[0];
                result.splice(i, 1, row);
                returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
            };

            if (returnsCount <= rows) {
                break;
            };
        };

    };

    return deleteEmptyReturns(result);
}

function deleteEmptyReturns(arr) {
    let text = arr.join("\n");
    text = text.replaceAll("\n\n", "\n");
    arr = text.split("\n");

    return arr;
}


function delTextIncluding(el, text) {

    const elArr = el.split(" ");

    for (let i = 0; i < elArr.length; i++) {
        const token = elArr[i];

        if (token === text || token === text + ":") {
            elArr.splice(i, elArr.length - 1);
        };
    };

    return elArr.join(" ");
}

function delTextExcluding(row, text) {

    row = row.replace(text, text + "~")

    const result = row.split("~");

    return result[0];
}

function removeComma(el) {
    let result = el.trim();

    if (result.endsWith(",") || result.endsWith(";")) {
        elArr = result.split("");
        elArr.splice(elArr.length - 1, 1);

        result = elArr.join("");
    };

    return result;
}

function calcReturnsCount(arr, value) {
    // debugger
    let count = 0;
    for (let el of arr) {
        count += Math.ceil(el.length / value);
    };

    return count;
}

function calcReturnsCount1(arr, value) {
    // debugger
    let rowsCount = 0;

    if (arr[0] !== "") {
        rowsCount = arr.length;
    };

    const lowChars = ["!", ".", ",", "„", "”"];
    const bigChars = ["Щ", "Ю", "М", "Ж", "М", "Ф"]

    for (let row of arr) {
        let paragraphCharsCount = 0;
        let currentRows = 0;

        for (let i = 0; i < row.length; i++) {
            let char = row[i];

            if (i === 0 || i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                continue;
            }

            if (lowChars.includes(char)) {
                paragraphCharsCount += 0.5;
            } else if (bigChars.includes(char)) {
                paragraphCharsCount += 1.5;
            } else {
                paragraphCharsCount += 1;
            };
        };

        // console.log(paragraphCharsCount);

        if (paragraphCharsCount > value) {
            currentRows = Math.ceil(paragraphCharsCount / value);
            rowsCount += currentRows - 1;
        };


        paragraphCharsCount = 0;
        currentRows = 0;
    };

    return rowsCount;
}

function separateTv(arr, allTvNames) {
    let separatedTv = {
        bnt1: [],
        btv: [],
        novaTv: [],
        novaNews: [],
        bnt2: [],
        bnt4: [],
        skat: [],
        diemaFemily: [],
        bulgariaOnAir: [],
        btvAction: [],
        btvComedy: [],
        btvCinema: [],
        btvStory: [],
        dizi: [],
        kinoNova: [],
        diema: [],
        hbo3: [],
        axn: [],
        starChanel: [],
        starLife: [],
        starCrime: [],
        hbo: [],
        hbo2: [],
        cinemax: [],
        viasatKino: [],
        cinemax2: [],
        nationalG: [],
        ngWild: [],
        viasatNature: [],
        bnt3: [],
        epicDrama: [],
        discovery: [],
        viasatExplorer: [],
        viasatHistory: [],
        history: [],
        kitchen24: [],
        diemaSport: [],
        diemaSport2: [],
        diemaSport3: [],
        novaSport: [],
        ring: [],
        eurosport: [],
        eurosport2: [],
        maxSport1: [],
        maxSport2: [],
        maxSport3: [],
        maxSport4: []
    };
    let currentTV = "";

    for (let currentRow of arr) {
        
        if (Object.keys(allTvNames).includes(currentRow)) {
            currentTV = allTvNames[currentRow]
        }

        if (currentTV === "") {
            isError = true;
        } else {
            separatedTv[currentTV].push(currentRow);
        };

    };
    return separatedTv;
};

function deleteExcluding(arr, rows, text, rowCharCount) {
    const result = arr;

    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];

            if (returnsCount > rows) {

                if (row.includes(text) && row.length > rowCharCount) {
                    row = delTextExcluding(row, text);
                    result.splice(i, 1, row);
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                };

            } else {
                break;
            };
        };
    };
    return result;
}

function deleteExcludingForce(arr, rows, text) {
    const result = arr;

    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];

            if (returnsCount > rows) {

                if (row.includes(text)) {
                    row = delTextExcluding(row, text);
                    result.splice(i, 1, row);
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                };

            } else {
                break;
            };
        };
    };
    return result;
}

function deleteIncluding(arr, rows, text, rowCharCount) {
    const result = arr;

    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];

            if (returnsCount > rows) {

                if (row.includes(text) && row.length > rowCharCount) {
                    row = delTextIncluding(row, text);
                    result.splice(i, 1, row);
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                };

            } else {
                break;
            };
        };
    };



    return result;
}

function convertAll(arr, rows, rowCharCount) {
    const result = arr;

    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];

            returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

            if (returnsCount > rows) {

                if (row.includes("режисьор") && row.length > rowCharCount) {
                    row = delTextIncluding(row, "режисьор");
                    result.splice(i, 1, row);
                };

            } else {
                break;
            }
        };
    };

    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];

            returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

            if (returnsCount > rows) {
                if (row.includes("сутрешен блок") && row.length > rows) {
                    row = delTextExcluding(row, "сутрешен блок");
                    result.splice(i, 1, row);
                };
            } else {
                break;
            };
        };
    };

    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];

            returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

            if (returnsCount > rows) {

                if (row.includes("филм") && row.length > rowCharCount) {
                    row = delTextExcluding(row, "филм");
                    result.splice(i, 1, row);
                };
            } else {
                break;
            };
        };
    };

    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    for (let i = 0; i < result.length; i++) {
        let el = result[i];
        el = removeComma(el);
        result.splice(i, 1, el);
    }

    return result;

}

function deleteByHours(arr, rows, hoursArr) {

    const result = arr;

    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);



    for (let i = 0; i < 7; i++) {
        let row = result[i];


        if (returnsCount > rows) {
            for (let hour of hoursArr) {

                if (row.startsWith(hour)) {
                    result.splice(i, 1)
                    i--;
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                    break;
                }
            }
        } else {
            break;
        };
    };



    for (let j = result.length - 1; j > result.length / 2; j--) {
        let row = result[j];

        if (returnsCount > rows) {
            for (let hour of hoursArr) {

                if (row.startsWith(hour)) {
                    result.splice(j, 1)
                    // j++;
                    returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
                    break;
                }
            }
        } else {
            break;
        };
    };


    return result;
};

function deleteAllExludingSpecific(arr, rows, text) {
    const result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {

        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            const isFound = row.search(text) !== -1;

            if (isFound) {
                const rowArr = row.split(" ");
                const hour = rowArr.shift();
                row = `${hour} ${text}`;
                result.splice(i, 1, row);
                returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
            };

            if (returnsCount <= rows) {
                break;
            };
        };
    };

    return result;
};

// 08.00 Купа на Франция: Ланс - Фени-Онуа, Ланс - Фени-Онуа - повторение

function removeRepeatedPhrases(arr) {
    const result = arr;
    // debugger
    for (let k = 2; k < result.length; k++) {
        const originalParagraph = result[k];
        let paragraph = result[k];
        paragraph = paragraph.replaceAll(",", "");
        const paragraphArr = paragraph.split(" ");
        let startIndex = -1;
        let endIndex = 0;
        let indexDifference = -1;
        let hasStartIndex = false;
        let isInARow = false;
        let counter = 0;
        let isModifiet = false;

        for (let i = 1; i < paragraphArr.length; i++) {
            let word = paragraphArr[i];

            if (!endIndex) {
                counter = i;
            }

            for (let j = endIndex + 1 + counter; j < paragraphArr.length; j++) {
                let nexWord = paragraphArr[j];

                if (word === nexWord && !hasStartIndex) {
                    paragraphArr.splice(startIndex + 1, indexDifference + 1);
                    indexDifference > -1 ? isModifiet = true : "";
                    indexDifference = -1;
                    isInARow = false;

                    startIndex = i;
                    hasStartIndex = true;
                    endIndex = j;
                    counter = 0;
                    break;
                };

                if (i === startIndex + 1 && word === nexWord && hasStartIndex && !isInARow) {
                    startIndex = i;
                    endIndex = j;
                    indexDifference = endIndex - startIndex;
                    isInARow = true;
                    break;
                };

                if (word === nexWord && isInARow) {
                    startIndex = i;
                    endIndex = j;
                    indexDifference = endIndex - startIndex;
                    break;
                } else {
                    isInARow = false;
                    hasStartIndex = false;
                }
            };
        };

        if (indexDifference && hasStartIndex && isInARow) {
            paragraphArr.splice(startIndex + 1, indexDifference + 1);
            isModifiet = true;
        };

        if (isModifiet) {
            paragraph = paragraphArr.join(" ");
            result.splice(k, 1, paragraph);
        };

    };

    return result;
};

function deleteRow(arr, rows, text) {
    const result = arr;
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount > rows) {
        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            let foundIndex = row.search(text);

            if (foundIndex !== -1) {
                result.splice(i, 1);
                i--;
            }
            returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

            if (returnsCount <= rows) {
                break;
            }
        }
    }

    return result;
}

function equalization(arr, rows, text, newText) {
    let result = arr
    let returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);

    if (returnsCount < rows) {
        for (let i = 0; i < result.length; i++) {

            if (returnsCount < rows) {
                let row = result[i];
                row = row.replace(text, newText);
                row = row.replace("  ", " ");
                result.splice(i, 1, row);
                returnsCount = calcReturnsCount1(result, tvCalcConstants[tvCalcValue]);
            } else {
                break;
            }
        };
    }

    return result
}


function hideNotification() {
    radioContainerElement.classList.remove("radio-container-notify");
    radioContainerElement.classList.add("radio-container");
    inputEl.classList.remove("tvTextWrong");
    inputEl.classList.remove("radio-container-notify");
    inputEl.classList.add("tvText");
    spanNotify.style.display = "none";
    spanClose.style.display = "none";
}

function hideNotificationInput() {
    inputEl.classList.remove("radio-container-notify");
    inputEl.classList.add("tvText");
    spanNotify.style.display = "none";
    spanClose.style.display = "none";
}

function closeNotification() {
    spanNotify.style.display = "none";
    spanClose.style.display = "none";
};

let isAddedGetFile = false;
// let isAddedSelectPath = false;

function tvBookView(event) {
    const allHrefs = document.querySelectorAll("a");
    allHrefs.forEach((x) => x.classList.remove("isActive"));
    event.currentTarget.classList.add("isActive");
    root.classList.remove("weather");
    body.classList.remove("weather");
    root.classList.remove("others");
    body.classList.remove("others");
    // root.classList.add("tv-book");
    body.classList.add("tv-book");
    root.replaceChildren(tvBookTemplate);
    tvCalcValue = "book";
    document.querySelector("#tv-book-form").addEventListener("submit", onConvert);
    document.querySelector("#tvBook").style.display = "none";
    document.getElementById("calcBtnTvBook").addEventListener("click", onCalc);
    document.getElementById("resetCalcTvBook").addEventListener("click", onResetCalc);
    document.getElementById("rename").addEventListener("click", onTvRename);
    document.getElementById("submitTvData").addEventListener("submit", onSubmitTvData);
    const getFileElementBook = document.getElementById("listFileBook");
    const selectFileElementBook = document.getElementById("selectFileBook");

    if (!isAddedGetFile) {
        getFileElementBook.addEventListener("click", () => selectFileElementBook.click());
        selectFileElementBook.addEventListener("change", () => addFileContent("inputBookArea", selectFileElementBook));
        isAddedGetFile = true;
    };

};

const tvBookTemplate = document.createElement("div");
tvBookTemplate.setAttribute("id", "test");
tvBookTemplate.innerHTML = `
    <span id="dateBook">
        <p>Day</p>
    </span>
    
    <section class="input-wraper">
        <div class="input-container">

            <div>
                <button class="selectFileBook" id="listFileBook">Select file</button>
                <input type="file" id="selectFileBook" accept=".txt" style="display: none">
            </div>

            <form id="tv-book-form" class="input">
                <textarea name="tvText" id="inputBookArea" class="tvText" placeholder="Paste your text here or click the 'Select File' button to choose"></textarea>
                <button type="submit" id="convertBtnTvBook">Convert</button>
                <textarea name="output" id="outputArea" class="tvText" placeholder="The converted text will appear here"></textarea>

                <div class="radio-container">
                    <input type="radio" id="tvBook" name="tv-radio" value="tvBook" checked>
                </div>
            </form>

            <div class="calc-container">
                <h1 id="calcCharsTvBook">Characters count: 0</h1>
                <h1 id="calcRowsTvBook">Rows count: 0</h1>
                <textarea name="calc" id="calcAreaBook" class="calcText"></textarea>
                <button id="calcBtnTvBook">Calculate chars</button>
                <button class="calcReset" id="resetCalcTvBook">Clear</button>
            </div>
        </div>
        <button id="rename" class="tvRename">TV-rename</button>
        <span class="renamedTvMessage" id="renamedTvMessage"></span>

        <div class="reportMessageTitleContainer">
            <span class="reportMessageTitle" id="missingFilesCount">Missing files: 0</span>
            <span class="reportMessageTitle1" id="missingDataCount">Missing data: 0</span>
        </div>

        <form id="submitTvData" class="outputTvDate">
            <select name="day" id="day">
                <option value="Понеделник" name="day">Понеделник</option>
                <option value="Вторник" name="day">Вторник</option>
                <option value="Сряда" name="day">Сряда</option>
                <option value="Четвъртък" name="day">Четвъртък</option>
                <option value="Петък" name="day">Петък</option>
                <option value="Събота" name="day">Събота</option>
                <option value="Неделя" name="day">Неделя</option>
            </select>
            <input type="text" name="date">
            <button class="submitAddTvData" id="submitAddTvDataBtv">submit</button>
        </form>
    
        <div>
            <textarea id="responseMessage" class="responseMessage"></textarea>
            <textarea id="missingFilesMessage" class="responseMessage"></textarea>
            <textarea id="missingDataMessega" class="responseMessage"></textarea>
        </div>
    </section>
`;



function tvPaperView(event) {
    const allHrefs = document.querySelectorAll("a");
    allHrefs.forEach((x) => x.classList.remove("isActive"));
    event.currentTarget.classList.add("isActive");
    root.classList.remove("tv-book");
    body.classList.remove("tv-book");
    root.classList.remove("weather");
    body.classList.remove("weather");
    root.classList.remove("others");
    body.classList.remove("others");
    root.replaceChildren(paperTemplate);
    tvCalcValue = "paper";
}

function weatherView(event) {
    const allHrefs = document.querySelectorAll("a");
    allHrefs.forEach((x) => x.classList.remove("isActive"));
    event.currentTarget.classList.add("isActive");
    root.classList.remove("tv-book");
    body.classList.remove("tv-book");
    root.classList.remove("others");
    body.classList.remove("others");
    // root.classList.add("weather");
    body.classList.add("weather");
    root.replaceChildren(weatherTemplate);
    document.getElementById("getBtnBG").addEventListener("click", onWeatherConvert);
    document.querySelector("#exchangeRates").addEventListener("click", exchangeRates);
    document.getElementById("exchangeRatesInput").style.display = "none";
}

const weatherTemplate = document.createElement("div");
weatherTemplate.setAttribute("id", "weather");
weatherTemplate.innerHTML = `
    <div class="weather-container">
        <textarea name="input" id=input class="text"></textarea>
        <div id="buttons-container">
          <button id="getBtnBG" Class="reset">Convert</button>
        </div>
    </div>

    <textarea name="currency" value="test" id="exchangeRatesInput">const currencyList = document.querySelectorAll(".center");
const currencyListArr = Array.from(currencyList);

const usd = currencyListArr[1].textContent;
const usdPref = currencyListArr[0].textContent;
const gbp = currencyListArr[13].textContent;
const gbpPref = currencyListArr[12].textContent;
const chf = currencyListArr[28].textContent;
const chfPref = currencyListArr[27].textContent;
const jpy = currencyListArr[4].textContent;
const jpyPref = currencyListArr[3].textContent;

document.write("Централен курс на БНБ: " + usd + "= " + usdPref + "; " + gbp + "= " + gbpPref + "; " + chf + "= " + chfPref + "; " + jpy + "= " + jpyPref)</textarea>
    <button id="exchangeRates" class="copyCode">Copy code/ exchange rates</button>
`;

let isPending = false;

function onOthersView(event) {
    root.replaceChildren(othersTemplate);
    const allHrefs = document.querySelectorAll("a");
    allHrefs.forEach((x) => x.classList.remove("isActive"));
    event.currentTarget.classList.add("isActive");
    root.classList.add("others");
    body.classList.add("others");

    // const selectPathInput = document.getElementById("dirPath");
    // const selectPathButton = document.getElementById("selectPath");
    document.getElementById("findReplaceForm").addEventListener("submit", onFindAndReplace);
    document.getElementById("copyIssueForm").addEventListener("submit", onCopyIssue);
    document.getElementById("application").addEventListener("change", onShowIssue);
    document.getElementById("renamePdfFiles").addEventListener("submit", onRenamePdfFiles);

    // if (!isAddedSelectPath) {
    //     selectPathButton.addEventListener("click", () => selectPathInput.click());
    //     selectPathInput.addEventListener("change", () => addFileContent("inputBookArea", selectPathInput));
    //     isAddedSelectPath = true;
    // };
};

const othersTemplate = document.createElement("div");
othersTemplate.setAttribute("id", "others");
othersTemplate.innerHTML = `   
    <h2 class="subTitle">Find and replace multiple files</h2>
    <form class="othersForm" id="findReplaceForm">
        <input type="text" name="path" id="path" placeholder="Folder path*">
        <input type="text" name="find" id="find" placeholder="Find*">
        <input type="text" name="changeTo" id="changeTo" placeholder="Replace">
        <input type="text" name="extension" id="extension" placeholder="File extension (Optional)">
        <button class="selectFile" id="findReplaceButton">Change</button>
        <span class="renamedTvMessage" id="renamedFilesMessage"></span>
    </form>
    <hr>
    <h2 class="subTitle">Copy issue</h2>
    <form class="othersForm" id="copyIssueForm">
        <input type="text" name="issue" id="issue" placeholder="Issue number*">
        <button class="selectFile" id="copyIssue">Copy</button>
        <textarea id="copyIssueMessage" class="copyIssueMessage"></textarea>
        <select name="application" id="application" class="weekendLabel">
                <option value="currentIssue" name="currentIssue">Current issue</option>        
                <option value="Weekend" name="application">Weekend photos</option>
                <option value="ZlatnoVreme" name="application">Zlatno vreme</option>
                <option value="Agro" name="application">Agro</option>
        </select>
        <input type="text" id="weekend" class="weekend" name="applicationIssue" placeholder="Application isssue*">
    </form>
    <hr class="mt">
    <h2 class="subTitle">Rename pdf files</h2>
    <form class="othersForm" id="renamePdfFiles">
        <input type="text" name="pathToPDF" id="pathToPDF" placeholder="Folder path*">
        <input type="text" name="currentDayNumber" id="currentDayNumber" placeholder="PDF files number*">
        <button class="selectFile" id="renamePdf">Rename</button>
    </form>
`;

async function onRenamePdfFiles(event) {
    event.preventDefault();
    const button = document.getElementById("renamePdf");
    button.setAttribute("disabled", true);

    const formData = new FormData(event.currentTarget);
    const path = formData.get("pathToPDF");
    const number = formData.get("currentDayNumber");

    try {
        const response = await fetch(`${baseURL}/rename/pdf`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ path, number })
        });

        const result = await response.json();

        alert(result.result);
    } catch (error) {
        alert(error.message);
    } finally {
        button.removeAttribute("disabled");
    };

}

function onShowIssue() {
    const applicationIssue = document.getElementById("weekend");
    const currentIssue = document.getElementById("issue");
    const choice = document.getElementById("application").value;

    if (choice !== "currentIssue") {

        if (choice !== "Weekend") {
            currentIssue.setAttribute("disabled", true);
            currentIssue.value = "";
        }

        applicationIssue.style.display = "inline-block"
    };

    if (choice === "currentIssue") {
        applicationIssue.style.display = "none";
        applicationIssue.value = "";
        currentIssue.removeAttribute("disabled");
    };

    if (choice === "Weekend") {
        currentIssue.removeAttribute("disabled");
    }
}

async function onFindAndReplace(event) {
    event.preventDefault();

    isPending = true;
    const message = document.getElementById("renamedFilesMessage");

    const findReplaceButton = document.getElementById("findReplaceButton");

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    if (!data.path) {
        return alert("Folder path is required!");
    };

    if (!data.find) {
        return alert("Find is required!");
    };

    findReplaceButton.setAttribute("disabled", true);

    if (isPending) {
        message.textContent = "Loading...";
        message.style.color = "black";
        message.style.display = "inline-block";
    }

    try {
        const response = await fetch(`${baseURL}/rename/files`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();

        message.textContent = result;
        message.style.display = "inline-block";
        message.style.color = "green";

    } catch (error) {
        message.textContent = error;
        message.style.color = "red";
        message.style.display = "inline-block";
    } finally {
        findReplaceButton.removeAttribute("disabled");
    };
}

async function onCopyIssue(event) {
    event.preventDefault();

    // const choice = document.getElementById("application").value;
    const message = document.getElementById("copyIssueMessage");
    message.value = "";
    message.style.color = "black";

    isPending = true;

    const copyIssueButton = document.getElementById("copyIssue");

    const formData = new FormData(event.currentTarget);

    const issue = formData.get("issue");
    const application = formData.get("application");
    const applicationIssue = formData.get("applicationIssue");

    if (!issue && (application === "currentIssue" || application === "Weekend")) {
        return alert("Issue is required!");
    };

    if ((application !== "currentIssue") && !applicationIssue) {
        return alert("Application isssue is required!")
    }

    copyIssueButton.setAttribute("disabled", true);

    if (isPending) {
        message.value = "Loading...";
    };

    try {
        const response = await fetch(`${baseURL}/copy/issue`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ issue, application, applicationIssue })
        });

        const result = await response.json();

        message.value = result;
        message.style.color = "green";

        if (result !== "Done") {
            message.style.color = "rgb(179, 121, 14)";
        }
    } catch (error) {
        message.value = error;
        message.style.color = "red";
    } finally {
        copyIssueButton.removeAttribute("disabled");
    };
}

function onWeatherConvert() {
    const inputEl = document.getElementById("input");
    let input = inputEl.value;
    input = input.replaceAll(". ", ".");
    const inputArr = input.split("\n");

    const result = [];

    if (inputArr[0].startsWith("София")) {

        for (let i = 0; i < inputArr.length; i++) {
            let el = inputArr[i];
            const elConverted = replaceSpaces(el);


            const elArr = elConverted.split(" ");
            const finalEl = elArr.splice(1, 2);
            result.push(finalEl);
        }

        let output = result.join("\n");
        output = output.replaceAll("\t\n", "\n");
        output = output.replaceAll(",", "");

        inputEl.value = output.trim();
    } else if (inputArr[0].startsWith("н.")) {
        for (let i = 0; i < inputArr.length; i++) {
            let el = inputArr[i];
            const elConverted = replaceSpaces(el);


            const elArr = elConverted.split(" ");
            elArr.splice(2, 1);
            elArr.shift();
            const finalEl = elArr.splice(0, 3);

            result.push(finalEl);
        }

        let output = result.join("\n");
        output = output.replaceAll("\t\n", "\n");
        output = output.replaceAll("\n\t", "\n");
        output = output.replaceAll(",", "");

        inputEl.value = output.trim();
    } else {
        return;
    }
}

function exchangeRates() {
    const code = document.getElementById("exchangeRatesInput");
    code.select();

    navigator.clipboard.writeText(code.value);
    window.location.replace("https://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/index.htm");
}

function replaceSpaces(text) {
    let index = text.search("  ");

    while (index >= 0) {
        text = text.replace("  ", " ");

        index = text.search("  ");
    }

    return text
};


async function onTvRename(event) {

    const renameTvButton = event.currentTarget;

    renameTvButton.setAttribute("disabled", true);
    const message = document.getElementById("renamedTvMessage");

    isPending = true;

    if (isPending) {
        message.textContent = "Loading...";
        message.style.display = "inline";
        message.style.color = "black";
    }

    try {

        const response = await fetch(`${baseURL}/rename/tv`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        const result = await response.json();

        message.textContent = result;
        message.style.display = "inline";
        message.style.color = "green";

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    } finally {
        isPending = false;
        renameTvButton.removeAttribute("disabled");
    }
}

async function onSubmitTvData(event) {
    event.preventDefault();
    isPending = true;

    const message = document.getElementById("renamedTvMessage");

    const submitTvDataButton = document.getElementById("submitAddTvDataBtv");

    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData);

    if (!data.day || !data.date) {
        return alert("Day and date is required!");
    };

    const regex = /^\d\d.\d\d.\d\d\d\d$/

    const match = data.date.match(regex);

    if (!match) {
        return alert(`Invalid date format! \n Should be: 'dd.mm.year' receive: '${data.date}'`);
    };

    const dateTokens = data.date.split(".");

    if (dateTokens[0] < 1 || dateTokens[0] > 31) {
        return alert(`Invalid day! \n Should be between 1 and 31 receive" '${dateTokens[0]}'`);
    };

    if (dateTokens[1] < 1 || dateTokens[1] > 12) {
        return alert(`Ivalid month! \n Should be between 1 and 12 receive: '${dateTokens[1]}'`);
    };

    submitTvDataButton.setAttribute("disabled", true);

    if (isPending) {
        message.textContent = "Loading...";
        message.style.display = "inline";
        message.style.color = "black";
    }

    const dataJSON = JSON.stringify(data);

    try {
        const response = await fetch(`${baseURL}/tv/add`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: dataJSON
        });

        const result = await response.json();

        if (typeof (result) === "string") {
            return alert(result);
        };

        const reportMessage = result.join("\n");
        const reportMissingFilesMessage = result.filter((x) => x.includes("File is missing!"));
        const reportMissingDataMessage = result.filter((x) => x.includes("NO DATA!"))

        const tvMessage = document.getElementById("responseMessage");
        const missingFilesMessage = document.getElementById("missingFilesMessage");
        const missingDataMessage = document.getElementById("missingDataMessega");

        const missingFilesCount = document.getElementById("missingFilesCount");
        missingFilesCount.textContent = `Missing files: ${reportMissingFilesMessage.length}`;

        const missingDataCount = document.getElementById("missingDataCount");
        missingDataCount.textContent = `Missing data: ${reportMissingDataMessage.length}`;

        if (reportMissingFilesMessage.length > 0) {
            missingFilesCount.style.color = "red";
        } else {
            missingFilesCount.style.color = "green";
        }

        if (reportMissingDataMessage.length > 0) {
            missingDataCount.style.color = "red";
        } else {
            missingDataCount.style.color = "green";
        };

        tvMessage.value = reportMessage;
        missingFilesMessage.value = reportMissingFilesMessage.join("\n");
        missingDataMessage.value = reportMissingDataMessage.join("\n");

        message.textContent = "Done";
        message.style.color = "green";

    } catch (error) {

        if (error.message === "Failed to fetch") {
            message.textContent = `${error.message}. \nThe server is probably not working!`;
            message.style.display = "block-inline";
            message.style.color = "red";
            return;
        }

        message.textContent = error.message;
    } finally {
        // message.textContent = "";
        isPending = false;
        submitTvDataButton.removeAttribute("disabled");
    }
};

function addFileContent(input, selectElememt) {
    const inputArea = document.getElementById(input);
    const file = selectElememt.files[0];

    const outputArea = document.getElementById("outputArea");
    outputArea.value = "";

    if (!file) {
        return;
    };

    const reader = new FileReader();

    reader.onload = (event) => {
        inputArea.value = event.target.result;
    };

    reader.readAsText(file);
}

function selectionChoiceHandler(radio, weekMatch, saturdayMatch, sundayMatch) {
    if (radio === "tvBook") {
        return "tvBook";
    };

    if (radio === "week" || (radio === "nothing" && weekMatch)) {
        return "week";
    };

    if (radio === "saturday" || (radio === "nothing" && saturdayMatch)) {
        return "saturday";
    };

    if (radio === "sunday" || (radio === "nothing" && sundayMatch)) {
        return "sunday";
    };
}

function isMatchHandler(radio, weekMatch, saturdayMatch, sundayMatch) {
    if (radio === "tvBook" ||
        radio === "nothing" ||
        (radio === "week" && weekMatch) ||
        (radio === "saturday" && saturdayMatch) ||
        (radio === "sunday" && sundayMatch)) {
        return true;
    }

    return false;
}

function isCorrectDayInputHandler(matchArr) {
    if ((matchArr.startsWith("Понеделник") ||
        matchArr.startsWith("Вторник") ||
        matchArr.startsWith("Сряда") ||
        matchArr.startsWith("Четвъртък") ||
        matchArr.startsWith("Петък") ||
        matchArr.startsWith("Събота") ||
        matchArr.startsWith("Неделя")
        && matchArr.length < 30)) {
        return true;
    };

    return false;
};
