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
document.getElementById("tv-book-view").addEventListener("click", tvBookView);
document.getElementById("tv-weather-view").addEventListener("click", weatherView)
const dateEl = document.querySelector("#date p");
const dateContainer = document.getElementById("date");

const tvCalcConstants = {
    paper: 30,
    book: 31
};

let tvCalcValue = "paper";

let radio = undefined;
let isError = false;
let message = "error";

const movies = ["криминален", "документален", "драма", "криминален", "екшън", "приключенски", "ужаси", "комедия",
    "романтичен", "романтика", "фантастика", "трилър", "хорър", "семеен", "уестърн", "мюзикъл"];
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
        return;
    };


    if (typeof (radio) === "object") {
        radioContainerElement.classList.add("radio-container-notify");
        message = "Please select the day";
        spanNotify.textContent = message;
        spanNotify.style.display = "block";
        spanClose.style.display = "inline";

        setTimeout(hideNotification, 3000);
        return;
    };

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
        bnt3: {
            "tvBook": 41
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
            "tvBook": 28
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
        cinemax: {
            "week": 21,
            "saturday": 23,
            "sunday": 21,
            "tvBook": 35
        },
        starChanel: {
            "week": 21,
            "saturday": 19,
            "sunday": 19,
            "tvBook": 28
        },
        starCrime: {
            "week": 21,
            "saturday": 19,
            "sunday": 19,
            "tvBook": 28
        },
        hbo2: {
            "tvBook": 30
        },
        discovery: {
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
        disneyChannel: {
            "tvBook": 36
        },
        epicDrama: {
            "tvBook": 36
        },
        theVoice: {
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
    const matchArr = tvArr[1]

    const separatedTv = separateTv(tvArr);
    // debugger


    if (isError && typeof (radio) === "string") {
        message = "Wrong input format!";

        spanNotify.textContent = message;
        spanNotify.style.display = "block";
        spanClose.style.display = "inline";
        inputEl.classList.add("radio-container-notify")

        setTimeout(hideNotificationInput, 3000);
        return;
    };

    const weekMatch = (matchArr.includes("Понеделник") && radio === "week" || matchArr.includes("Вторник") && radio === "week"
        || matchArr.includes("Сряда") && radio === "week" || matchArr.includes("Четвъртък") && radio === "week"
        || matchArr.includes("Петък") && radio === "week");

    const saturdayMatch = (matchArr.includes("Събота") && radio === "saturday");
    const sundayMatch = (matchArr.includes("Неделя") && radio === "sunday");

    if (!weekMatch && !saturdayMatch && !sundayMatch && radio !== "tvBook") {
        const choice = confirm("The day doesn't match! Ary you sure you want to continue?");

        if (!choice) {
            return;
        };
    };

    separatedTv.bnt1 = replaceTextForce(separatedTv.bnt1, "документален", "док.");
    separatedTv.bnt1 = deleteByHours(separatedTv.bnt1, rows.bnt1[radio], ["00", "01", "02", "03", "04"]);
    separatedTv.bnt1 = convertAll(separatedTv.bnt1, rows.bnt1[radio], tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteGenre(separatedTv.bnt1, rows.bnt1[radio]);
    separatedTv.bnt1 = deleteIncluding(separatedTv.bnt1, rows.bnt1[radio], "/избрано/");
    separatedTv.bnt1 = deleteByHourAndTextExcluding(separatedTv.bnt1, rows.bnt1[radio], ["05", "06"], "Денят започва", "сутрешен блок");
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[radio], "пряко", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[radio], "токшоу", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[radio], "куиз шоу", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteIncluding(separatedTv.bnt1, rows.bnt1[radio], "режисьор", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = deleteByHourAndTextExcluding(separatedTv.bnt1, rows.bnt1[radio], ["07"], "Денят започва", "сутрешен блок");
    separatedTv.bnt1 = deleteByHours(separatedTv.bnt1, rows.bnt1[radio], ["23"]);
    separatedTv.bnt1 = deleteExcluding(separatedTv.bnt1, rows.bnt1[radio], "Имате среща с ...", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt1 = replaceText(separatedTv.bnt1, rows.bnt1[radio], "БГ киновечер: ", "");
    separatedTv.bnt1 = deleteEndComma(separatedTv.bnt1);
    separatedTv.bnt2 = deleteByHours(separatedTv.bnt2, rows.bnt2[radio], ["00", "01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.bnt2 = deleteExcluding(separatedTv.bnt2, rows.bnt2[radio], "Лека нощ, деца!", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = deleteGenre(separatedTv.bnt2, rows.bnt2[radio]);
    separatedTv.bnt2 = deleteIncluding(separatedTv.bnt2, rows.bnt2[radio], "режисьор", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = deleteIncluding(separatedTv.bnt2, rows.bnt2[radio], "предаване", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = replaceText(separatedTv.bnt2, rows.bnt2[radio], "сериен", "сер.");
    separatedTv.bnt2 = deleteIncluding(separatedTv.bnt2, rows.bnt2[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt2 = deleteEndComma(separatedTv.bnt2);
    separatedTv.bnt3 = deleteByHours(separatedTv.bnt3, rows.bnt3[radio], ["01", "02", "03", "04", "05", "06", "00"]);
    separatedTv.bnt3 = deleteIncluding(separatedTv.bnt3, rows.bnt3[radio], "режисьор", tvCalcConstants[tvCalcValue]);
    separatedTv.bnt3 = deleteGenre(separatedTv.bnt3, rows.bnt3[radio]);
    separatedTv.bnt3 = deleteEndComma(separatedTv.bnt3);
    separatedTv.bnt4 = deleteByHours(separatedTv.bnt4, rows.bnt4[radio], ["02", "03", "04"]);
    separatedTv.bnt4 = deleteExcluding(separatedTv.bnt4, rows.bnt4[radio], "токшоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = convertAll(separatedTv.btv, rows.btv[radio], tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteByHours(separatedTv.btv, rows.btv[radio], ["01", "02", "03", "04", "05", "06", "00"]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[radio], "токшоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[radio], "куиз шоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[radio], "забавно шоу", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[radio], "поредица", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteExcluding(separatedTv.btv, rows.btv[radio], "телевизионна игра", tvCalcConstants[tvCalcValue]);
    separatedTv.btv = deleteGenre(separatedTv.btv, rows.btv[radio]);
    separatedTv.btv = deletePatternIncluding(separatedTv.btv, rows.btv[radio], /с водеща |с водещи |с водещ /);
    separatedTv.btv = deleteEndComma(separatedTv.btv);
    separatedTv.novaTv = deleteByHours(separatedTv.novaTv, rows.novaTv[radio], ["01", "02", "03", "04", "05"]);
    separatedTv.novaTv = convertAll(separatedTv.novaTv, rows.novaTv[radio], tvCalcConstants[tvCalcValue]);
    separatedTv.novaTv = replaceText(separatedTv.novaTv, rows.novaTv[radio], "(премиера)", "");
    separatedTv.novaTv = replaceText(separatedTv.novaTv, rows.novaTv[radio], "с уч.", "игрален филм с уч.");
    separatedTv.novaTv = deleteExcluding(separatedTv.novaTv, rows.novaTv[radio], "игрален филм", tvCalcConstants[tvCalcValue]);
    separatedTv.novaTv = equalization(separatedTv.novaTv, rows.novaTv[radio], "сер.", "сериен телевизионен филм");
    separatedTv.novaNews = convertAll(separatedTv.novaNews, rows.novaNews[radio], tvCalcConstants[tvCalcValue]);
    separatedTv.novaNews = deleteByHours(separatedTv.novaNews, rows.novaNews[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "09", "23", "00"]);
    separatedTv.novaNews = deleteByHourAndText(separatedTv.novaNews, rows.novaNews[radio], ["11.00", "13.00", "15.00", "16.00", "18.00", "21.00"], "Новините");
    separatedTv.novaNews = deleteExcluding(separatedTv.novaNews, rows.novaNews[radio], "поредица", tvCalcConstants[tvCalcValue]);
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[radio], "документална поредица", "поредица");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[radio], " на DW", "");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[radio], "(премиера) ", "");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[radio], "икономическо предаване", "предаване");
    separatedTv.novaNews = replaceText(separatedTv.novaNews, rows.novaNews[radio], "публицистично токшоу", "токшоу");
    separatedTv.hbo = deleteIncluding(separatedTv.hbo, rows.hbo[radio], "реж.", tvCalcConstants[tvCalcValue]);
    separatedTv.hbo = deleteGenre(separatedTv.hbo, rows.hbo[radio]);
    separatedTv.hbo = deleteByHours(separatedTv.hbo, rows.hbo[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.hbo = deleteEndComma(separatedTv.hbo);
    separatedTv.axn = deleteAfterEpisode(separatedTv.axn, rows.axn[radio]);
    separatedTv.axn = deleteEndComma(separatedTv.axn);
    separatedTv.axn = deleteByHours(separatedTv.axn, rows.axn[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.axn = replaceTextForce(separatedTv.axn, "сезон", "сер.");
    separatedTv.axn = deleteExcludingForce(separatedTv.axn, rows.axn[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.axn = replaceTextForce(separatedTv.axn, "сер. ", "сезон ");
    separatedTv.axn = deleteRepetedRows1(separatedTv.axn, rows.axn[radio]);
    separatedTv.axn = equalization(separatedTv.axn, rows.axn[radio], "еп.", "епизод");
    separatedTv.axn = equalization(separatedTv.axn, rows.axn[radio], ";", " - ");
    separatedTv.kinoNova = deleteByHours(separatedTv.kinoNova, rows.kinoNova[radio], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.kinoNova = deleteGenre(separatedTv.kinoNova, rows.kinoNova[radio]);
    separatedTv.kinoNova = deleteEndComma(separatedTv.kinoNova);
    separatedTv.diema = deleteGenre(separatedTv.diema, rows.diema[radio]);
    separatedTv.diema = deleteByHours(separatedTv.diema, rows.diema[radio], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.diema = deleteEndComma(separatedTv.diema);
    separatedTv.btvAction = deleteGenre(separatedTv.btvAction, rows.btvAction[radio]);
    separatedTv.btvAction = deleteByHours(separatedTv.btvAction, rows.btvAction[radio], ["01", "02", "03", "04", "05", "06", "07"]);
    separatedTv.btvAction = deleteExcludingForce(separatedTv.btvAction, rows.btvAction[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteRepetedRows(separatedTv.btvAction, rows.btvAction[radio]);
    separatedTv.btvAction = deleteExcludingForce(separatedTv.btvAction, rows.btvAction[radio], "предаване,", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteSpecific(separatedTv.btvAction, "екстремно");
    separatedTv.btvAction = deleteExcluding(separatedTv.btvAction, rows.btvAction[radio], "предаване", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteExcluding(separatedTv.btvAction, rows.btvAction[radio], "телевизионна игра", tvCalcConstants[tvCalcValue]);
    separatedTv.btvAction = deleteEndComma(separatedTv.btvAction);
    separatedTv.btvAction = replaceText(separatedTv.btvAction, rows.btvAction[radio], "ПРЕМИЕРА: ", "");
    separatedTv.btvAction = replaceText(separatedTv.btvAction, rows.btvAction[radio], "Премиера: ", "");
    separatedTv.btvAction = replaceText(separatedTv.btvAction, rows.btvAction[radio], "документална поредица", "поредица");
    separatedTv.btvAction = deleteByHours(separatedTv.btvAction, rows.btvAction[radio], ["00", "23"]);
    separatedTv.btvComedy = deleteGenre(separatedTv.btvComedy, rows.btvComedy[radio]);
    separatedTv.btvComedy = deleteExcludingForce(separatedTv.btvComedy, rows.btvComedy[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvComedy = deleteExcludingForce(separatedTv.btvComedy, rows.btvComedy[radio], "сер.,", tvCalcConstants[tvCalcValue]);
    separatedTv.btvComedy = deleteRepetedRows1(separatedTv.btvComedy, rows.btvComedy[radio]);
    separatedTv.btvComedy = replaceTextForce(separatedTv.btvComedy, "Премиера: ", "");
    separatedTv.btvComedy = deleteByHours(separatedTv.btvComedy, rows.btvComedy[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.btvComedy = replaceText(separatedTv.btvComedy, rows.btvComedy[radio], "сериал,", "");
    separatedTv.btvCinema = deleteGenre(separatedTv.btvCinema, rows.btvCinema[radio]);
    separatedTv.btvCinema = deleteByHours(separatedTv.btvCinema, rows.btvCinema[radio], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.btvCinema = deleteExcludingForce(separatedTv.btvCinema, rows.btvCinema[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvCinema = deleteRepetedRows1(separatedTv.btvCinema, rows.btvCinema[radio]);
    separatedTv.btvCinema = deleteEndComma(separatedTv.btvCinema);
    separatedTv.dizi = deleteByHours(separatedTv.dizi, rows.dizi[radio], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.starLife = deleteByHours(separatedTv.starLife, rows.starLife[radio], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.starLife = deleteAfterEpisode(separatedTv.starLife, rows.starLife[radio]);
    separatedTv.starLife = deletePatternIncluding(separatedTv.starLife, rows.starLife[radio], /еп. \d+/);
    separatedTv.starLife = deleteRepetedRows1(separatedTv.starLife, rows.starLife[radio]);
    separatedTv.starLife = deleteEndComma(separatedTv.starLife);
    separatedTv.viasatKino = replaceTextForce(separatedTv.viasatKino, "/", " ");
    separatedTv.viasatKino = deleteGenre(separatedTv.viasatKino, rows.viasatKino[radio]);
    separatedTv.viasatKino = deleteByHours(separatedTv.viasatKino, rows.viasatKino[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "09", "00"]);
    separatedTv.viasatKino = replaceTextForce(separatedTv.viasatKino, "TV 1000", "Viasat Kino");
    separatedTv.ring = replaceText(separatedTv.ring, rows.ring[radio], "документална поредица", "поредица");
    separatedTv.ring = replaceText(separatedTv.ring, rows.ring[radio], "ПРЯКО", "");
    separatedTv.ring = deleteExcluding(separatedTv.ring, rows.ring[radio], "обзор", tvCalcConstants[tvCalcValue]);
    separatedTv.ring = deleteByHours(separatedTv.ring, rows.ring[radio], ["03", "04", "05", "06"]);
    separatedTv.ring = replaceText(separatedTv.ring, rows.ring[radio], " : ", " ");
    separatedTv.cinemax = deleteGenre(separatedTv.cinemax, rows.cinemax[radio]);
    separatedTv.cinemax = deleteByHours(separatedTv.cinemax, rows.cinemax[radio], ["01", "02", "03", "04", "05", "06", "07", "08"])
    separatedTv.cinemax = deleteEndComma(separatedTv.cinemax);
    separatedTv.starChanel = replaceTextForce(separatedTv.starChanel, "еп.", "сер.");
    separatedTv.starChanel = deleteExcludingForce(separatedTv.starChanel, rows.starChanel[radio], "сер.", tvCalcConstants[tvCalcValue]);
    // separatedTv.starChanel = deleteRepetedRows1(separatedTv.starChanel, rows.starChanel[radio]);
    separatedTv.starChanel = deleteByHours(separatedTv.starChanel, rows.starChanel[radio], ["01", "02", "03", "04", "05", "06", "07", "08"]);
    separatedTv.starCrime = deleteByHours(separatedTv.starCrime, rows.starCrime[radio], ["01", "02", "03", "04", "05", "06", "07", "08"]);
    separatedTv.starCrime = replaceTextForce(separatedTv.starCrime, "еп.", "сер.");
    separatedTv.starCrime = deleteRepetedRows1(separatedTv.starCrime, rows.starCrime[radio]);
    separatedTv.skat = deleteByHours(separatedTv.skat, rows.skat[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.skat = deleteExcluding(separatedTv.skat, rows.skat[radio], "Новини", tvCalcConstants[tvCalcValue]);
    separatedTv.skat = replaceText(separatedTv.skat, rows.skat[radio], "публицистично", "");
    separatedTv.skat = deleteExcluding(separatedTv.skat, rows.skat[radio], "предаване", tvCalcConstants[tvCalcValue]);
    separatedTv.skat = deleteIncluding(separatedTv.skat, rows.skat[radio], "-", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaFemily = deleteByHours(separatedTv.diemaFemily, rows.diemaFemily[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.diemaFemily = deleteGenre(separatedTv.diemaFemily, rows.diemaFemily[radio]);
    separatedTv.bulgariaOnAir = deleteByHours(separatedTv.bulgariaOnAir, rows.bulgariaOnAir[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.bulgariaOnAir = deleteGenre(separatedTv.bulgariaOnAir, rows.bulgariaOnAir[radio]);
    separatedTv.btvStory = deleteByHours(separatedTv.btvStory, rows.btvStory[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.btvStory = deleteExcluding(separatedTv.btvStory, rows.btvStory[radio], "сер.", tvCalcConstants[tvCalcValue]);
    separatedTv.btvStory = replaceTextForce(separatedTv.btvStory, "Премиера: ", "");
    separatedTv.btvStory = deleteRepetedRows1(separatedTv.btvStory, rows.btvStory[radio]);
    separatedTv.btvStory = deleteGenre(separatedTv.btvStory, rows.btvStory[radio]);
    separatedTv.btvStory = replaceText(separatedTv.btvStory, rows.btvStory[radio], "сериал,", "")
    separatedTv.starChanel = deleteByHours(separatedTv.starChanel, rows.starChanel[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.hbo2 = deleteByHours(separatedTv.hbo2, rows.hbo2[radio], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.hbo2 = deleteGenre(separatedTv.hbo2, rows.hbo2[radio]);
    separatedTv.hbo2 = deleteEndComma(separatedTv.hbo2, rows.hbo2[radio]);
    separatedTv.discovery = deleteByHours(separatedTv.discovery, rows.discovery[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.discovery = replaceTextForce(separatedTv.discovery, "_==", " ");
    separatedTv.discovery = replaceTextForce(separatedTv.discovery, ":", " -")
    separatedTv.discovery = deleteIncluding(separatedTv.discovery, rows.discovery[radio], "-", tvCalcConstants[tvCalcValue]);
    separatedTv.nationalG = deleteByHours(separatedTv.nationalG, rows.nationalG[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.ngWild = deleteByHours(separatedTv.ngWild, rows.ngWild[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.viasatNature = deleteByHours(separatedTv.viasatNature, rows.viasatNature[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.disneyChannel = deleteByHours(separatedTv.disneyChannel, rows.disneyChannel[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.disneyChannel = deleteRepetedRows1(separatedTv.disneyChannel, rows.disneyChannel[radio]);
    separatedTv.epicDrama = deleteByHours(separatedTv.epicDrama, rows.epicDrama[radio], ["01", "02", "03", "04", "05", "06", "07", "00"]);
    separatedTv.epicDrama = deletePatternIncluding(separatedTv.epicDrama, rows.epicDrama[radio], /еп. \d+/);
    separatedTv.theVoice = deleteByHours(separatedTv.theVoice, rows.theVoice[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.viasatExplorer = deleteByHours(separatedTv.viasatExplorer, rows.viasatExplorer[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.history = deleteByHours(separatedTv.history, rows.history[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.kitchen24 = deleteByHours(separatedTv.kitchen24, rows.kitchen24[radio], ["01", "02", "03", "04", "05", "06", "07", "08", "00"]);
    separatedTv.diemaSport = deleteExcluding(separatedTv.diemaSport, rows.diemaSport[radio], "Обзор", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaSport = deleteExcluding(separatedTv.diemaSport, rows.diemaSport[radio], "обзор", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaSport = deleteExcluding(separatedTv.diemaSport, rows.diemaSport[radio], "efbet Лига", tvCalcConstants[tvCalcValue]);
    separatedTv.diemaSport = deletePatternIncluding(separatedTv.diemaSport, rows.diemaSport[radio], /\d{4}\/\d{4}/);
    separatedTv.diemaSport = deletePatternIncluding(separatedTv.diemaSport, rows.diemaSport[radio], /\d{2}\.\d{2} Програмна пауза/);
    separatedTv.diemaSport = replaceText(separatedTv.diemaSport, rows.diemaSport[radio], "Световното първенство", "СП");
    separatedTv.diemaSport2 = deletePatternIncluding(separatedTv.diemaSport2, rows.diemaSport2[radio], /\d{4}\/\d{4}/);
    separatedTv.diemaSport2 = deletePatternIncluding(separatedTv.diemaSport2, rows.diemaSport2[radio], /\d{2}\.\d{2} Програмна пауза/);
    separatedTv.diemaSport2 = replaceText(separatedTv.diemaSport2, rows.diemaSport2[radio], " /n/", "");
    separatedTv.diemaSport2 = replaceText(separatedTv.diemaSport2, rows.diemaSport2[radio], "/n/", "");
    separatedTv.diemaSport2 = replaceText(separatedTv.diemaSport2, rows.diemaSport2[radio], "Световното първенство", "СП");
    separatedTv.diemaSport3 = deleteAllExludingSpecific(separatedTv.diemaSport3, rows.diemaSport3[radio], "Формула 1");
    separatedTv.diemaSport3 = deleteAllExludingSpecific(separatedTv.diemaSport3, rows.diemaSport3[radio], "Формула 2");
    separatedTv.diemaSport3 = deleteAllExludingSpecific(separatedTv.diemaSport3, rows.diemaSport3[radio], "Формула 3");
    separatedTv.diemaSport3 = deleteRepetedRows1(separatedTv.diemaSport3, rows.diemaSport3[radio]);
    separatedTv.diemaSport3 = replaceText(separatedTv.diemaSport3, rows.diemaSport3[radio], " /n/", "");
    separatedTv.diemaSport3 = replaceText(separatedTv.diemaSport3, rows.diemaSport3[radio], "/n/", "");
    separatedTv.diemaSport3 = deletePatternIncluding(separatedTv.diemaSport3, rows.diemaSport3[radio], /\d{4}\/\d{4}/);
    separatedTv.diemaSport3 = replaceText(separatedTv.diemaSport3, rows.diemaSport3[radio], "Световното първенство", "СП");
    separatedTv.novaSport = replaceText(separatedTv.novaSport, rows.novaSport[radio], " /n/", "");
    separatedTv.novaSport = replaceText(separatedTv.novaSport, rows.novaSport[radio], "/n/", "");
    separatedTv.eurosport = replaceText(separatedTv.eurosport, rows.eurosport[radio], ":", " :");
    separatedTv.eurosport = deleteIncluding(separatedTv.eurosport, rows.eurosport[radio], ":", tvCalcConstants[tvCalcValue]);
    separatedTv.eurosport = deleteRepetedRows1(separatedTv.eurosport, rows.eurosport[radio]);
    separatedTv.eurosport2 = replaceText(separatedTv.eurosport2, rows.eurosport2[radio], ":", " :");
    separatedTv.eurosport2 = deleteIncluding(separatedTv.eurosport2, rows.eurosport2[radio], ":", tvCalcConstants[tvCalcValue]);
    separatedTv.eurosport2 = deleteRepetedRows1(separatedTv.eurosport2, rows.eurosport2[radio]);
    separatedTv.maxSport1 = removeRepeatedPhrases(separatedTv.maxSport1);
    separatedTv.maxSport1 = replaceText(separatedTv.maxSport1, rows.maxSport1[radio], "ПРЯКО", "");
    separatedTv.maxSport1 = replaceText(separatedTv.maxSport1, rows.maxSport1[radio], " ,", "");
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "ATP 1000", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteRepetedRows1(separatedTv.maxSport1, rows.maxSport1[radio]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Moto GP", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Moto 2", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Moto 3", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Moto E", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Nascar Cup Series", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Световен рали шампионат", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteExcluding(separatedTv.maxSport1, rows.maxSport1[radio], "Европейски рали шампионат", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport1 = deleteRepetedRows1(separatedTv.maxSport1, rows.maxSport1[radio]);
    separatedTv.maxSport2 = removeRepeatedPhrases(separatedTv.maxSport2);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[radio], "Moto GP", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[radio], "Moto 2", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[radio], "Moto 3", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[radio], "Световен рали шампионат", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[radio], "UFC Fight Night", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteExcluding(separatedTv.maxSport2, rows.maxSport2[radio], "Nascar Cup Series", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport2 = deleteRepetedRows1(separatedTv.maxSport2, rows.maxSport2[radio]);
    separatedTv.maxSport3 = removeRepeatedPhrases(separatedTv.maxSport3);
    separatedTv.maxSport3 = removeRepeatedPhrases(separatedTv.maxSport3);
    separatedTv.maxSport3 = deleteExcluding(separatedTv.maxSport3, rows.maxSport3[radio], "Moto GP", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport3 = deleteExcluding(separatedTv.maxSport3, rows.maxSport3[radio], "Moto 2", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport3 = deleteExcluding(separatedTv.maxSport3, rows.maxSport3[radio], "Moto 3", tvCalcConstants[tvCalcValue]);
    separatedTv.maxSport3 = deleteRepetedRows1(separatedTv.maxSport3, rows.maxSport3[radio]);
    separatedTv.maxSport4 = removeRepeatedPhrases(separatedTv.maxSport4);
    separatedTv.maxSport4 = replaceText(separatedTv.maxSport4, rows.maxSport4[radio], "ПРЯКО", "");
    separatedTv.maxSport4 = replaceText(separatedTv.maxSport4, rows.maxSport4[radio], " ,", " ");
    separatedTv.maxSport4 = deleteRow(separatedTv.maxSport4, rows.maxSport4[radio], 'Студио "Футбол"');


    let output = "";

    if (radio === "week") {
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
    } else if (radio === "saturday") {
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
    } else if (radio === "sunday") {
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
    } else if (radio === "tvBook") {
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
            + separatedTv.bnt3.join("\n") + "\n\n"
            + separatedTv.axn.join("\n") + "\n\n"
            + separatedTv.starChanel.join("\n") + "\n\n"
            + separatedTv.starLife.join("\n") + "\n\n"
            + separatedTv.starCrime.join("\n") + "\n\n"
            + separatedTv.hbo.join("\n") + "\n\n"
            + separatedTv.hbo2.join("\n") + "\n\n"
            + separatedTv.cinemax.join("\n") + "\n\n"
            + separatedTv.viasatKino.join("\n") + "\n\n"
            + separatedTv.discovery.join("\n") + "\n\n"
            + separatedTv.nationalG.join("\n") + "\n\n"
            + separatedTv.ngWild.join("\n") + "\n\n"
            + separatedTv.viasatNature.join("\n") + "\n\n"
            + separatedTv.disneyChannel.join("\n") + "\n\n"
            + separatedTv.epicDrama.join("\n") + "\n\n"
            + separatedTv.theVoice.join("\n") + "\n\n"
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

    if (dateElBookContainer) {
        dateElBookContainer.style.display = "inline";
        dateElBook.textContent = tvArr[1];
    }

    dateEl.textContent = tvArr[1];
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

    row = row.replace(text, text + " ~")
    const elArr = row.split(" ");

    for (let i = 0; i < elArr.length; i++) {
        const token = elArr[i];

        if (token === "~" || token === "~," || token === "~;" || token === "~:") {
            elArr.splice(i, elArr.length - 1);
        };
    };

    return elArr.join(" ");
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

        console.log(paragraphCharsCount);

        if (paragraphCharsCount > value) {
            currentRows = Math.ceil(paragraphCharsCount / value);
            rowsCount += currentRows - 1;
        };


        paragraphCharsCount = 0;
        currentRows = 0;
    };

    return rowsCount;
}

function separateTv(arr) {
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
        bnt3: [],
        axn: [],
        starChanel: [],
        starLife: [],
        starCrime: [],
        hbo: [],
        hbo2: [],
        cinemax: [],
        viasatKino: [],
        discovery: [],
        nationalG: [],
        ngWild: [],
        viasatNature: [],
        disneyChannel: [],
        epicDrama: [],
        theVoice: [],
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

    for (let el of arr) {
        if (el.startsWith("БНТ 1") && el.endsWith("БНТ 1")) {
            currentTV = "bnt1";
        };

        if (el.startsWith("bTV") && el.endsWith("bTV")) {
            currentTV = "btv";
        };

        if (el.startsWith("NOVA TV") && el.endsWith("NOVA TV")) {
            currentTV = "novaTv";
        };

        if (el.startsWith("NOVA NEWS") && el.endsWith("NOVA NEWS")) {
            currentTV = "novaNews";
        };

        if (el.startsWith("БНТ 2") && el.endsWith("БНТ 2")) {
            currentTV = "bnt2";
        };

        if (el.startsWith("БНТ 4") && el.endsWith("БНТ 4")) {
            currentTV = "bnt4";
        };

        if (el.startsWith("skat") && el.endsWith("skat")) {
            currentTV = "skat";
        };

        if (el.startsWith("Diema family") && el.endsWith("Diema family")) {
            currentTV = "diemaFemily";
        };

        if (el.startsWith("Bulgaria on air") && el.endsWith("Bulgaria on air")) {
            currentTV = "bulgariaOnAir";
        };

        if (el.startsWith("bTV action") && el.endsWith("bTV action")) {
            currentTV = "btvAction";
        };

        if (el.startsWith("bTV comedy") && el.endsWith("bTV comedy")) {
            currentTV = "btvComedy";
        };

        if (el.startsWith("bTV cinema") && el.endsWith("bTV cinema")) {
            currentTV = "btvCinema";
        };

        if (el.startsWith("bTV Story") && el.endsWith("bTV Story")) {
            currentTV = "btvStory";
        };

        if (el.startsWith("Dizi") && el.endsWith("Dizi")) {
            currentTV = "dizi";
        };

        if (el.startsWith("Diema") && el.endsWith("Diema")) {
            currentTV = "diema";
        };

        if (el.startsWith("KINO NOVA") && el.endsWith("KINO NOVA")) {
            currentTV = "kinoNova";
        };

        if (el.startsWith("БНТ 3") && el.endsWith("БНТ 3")) {
            currentTV = "bnt3";
        };

        if (el.startsWith("AXN") && el.endsWith("AXN")) {
            currentTV = "axn";
        };

        if (el.startsWith("Star Channel") && el.endsWith("Star Channel")) {
            currentTV = "starChanel";
        };

        if (el.startsWith("Star Life") && el.endsWith("Star Life")) {
            currentTV = "starLife";
        };

        if (el.startsWith("Star Crime") && el.endsWith("Star Crime")) {
            currentTV = "starCrime";
        };

        if (el.startsWith("HBO") && el.endsWith("HBO")) {
            currentTV = "hbo";
        };

        if (el.startsWith("HBO 2") && el.endsWith("HBO 2")) {
            currentTV = "hbo2";
        };

        if (el.startsWith("Cinemax") && el.endsWith("Cinemax")) {
            currentTV = "cinemax";
        };

        if (el.startsWith("TV 1000") && el.endsWith("TV 1000")) {
            currentTV = "viasatKino";
        };

        if (el.startsWith("Discovery") && el.endsWith("Discovery")) {
            currentTV = "discovery";
        };

        if (el.startsWith("National G") && el.endsWith("National G")) {
            currentTV = "nationalG";
        };

        if (el.startsWith("NG wild") && el.endsWith("NG wild")) {
            currentTV = "ngWild";
        };

        if (el.startsWith("Viasat Nature") && el.endsWith("Viasat Nature")) {
            currentTV = "viasatNature";
        };

        if (el.startsWith("Disney channel") && el.endsWith("Disney channel")) {
            currentTV = "disneyChannel";
        };

        if (el.startsWith("Epic Drama") && el.endsWith("Epic Drama")) {
            currentTV = "epicDrama";
        };

        if (el.startsWith("The Voice") && el.endsWith("The Voice")) {
            currentTV = "theVoice";
        };

        if (el.startsWith("Viasat Explorer") && el.endsWith("Viasat Explorer")) {
            currentTV = "viasatExplorer";
        };

        if (el.startsWith("Viasat History") && el.endsWith("Viasat History")) {
            currentTV = "viasatHistory";
        };

        if (el.startsWith("History") && el.endsWith("History")) {
            currentTV = "history";
        };

        if (el.startsWith("24kitchen") && el.endsWith("24kitchen")) {
            currentTV = "kitchen24";
        };

        if (el.startsWith("Diema sport") && el.endsWith("Diema sport")) {
            currentTV = "diemaSport";
        };

        if (el.startsWith("Diema sport2") && el.endsWith("Diema sport2")) {
            currentTV = "diemaSport2";
        };

        if (el.startsWith("Diema sport3") && el.endsWith("Diema sport3")) {
            currentTV = "diemaSport3";
        };

        if (el.startsWith("Nova sport") && el.endsWith("Nova sport")) {
            currentTV = "novaSport";
        };

        if (el.startsWith("Ring") && el.endsWith("Ring")) {
            currentTV = "ring";
        };

        if (el.startsWith("Eurosport") && el.endsWith("Eurosport")) {
            currentTV = "eurosport";
        };

        if (el.startsWith("Eurosport 2") && el.endsWith("Eurosport 2")) {
            currentTV = "eurosport2";
        };

        if (el.startsWith("Max Sport 1") && el.endsWith("Max Sport 1")) {
            currentTV = "maxSport1";
        };

        if (el.startsWith("Max Sport 2") && el.endsWith("Max Sport 2")) {
            currentTV = "maxSport2";
        };

        if (el.startsWith("Max Sport 3") && el.endsWith("Max Sport 3")) {
            currentTV = "maxSport3";
        };

        if (el.startsWith("Max Sport 4") && el.endsWith("Max Sport 4")) {
            currentTV = "maxSport4";
        };

        if (currentTV === "") {
            isError = true;
        } else {
            separatedTv[currentTV].push(el);
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

function tvBookView(event) {
    const allHrefs = document.querySelectorAll("a");
    allHrefs.forEach((x) => x.classList.remove("isActive"));
    event.currentTarget.classList.add("isActive");
    root.classList.remove("weather");
    body.classList.remove("weather");
    root.classList.add("tv-book");
    body.classList.add("tv-book");
    root.replaceChildren(tvBookTemplate);
    tvCalcValue = "book";
    document.querySelector("#tv-book-form").addEventListener("submit", onConvert);
    document.querySelector("#tvBook").style.display = "none";
    document.getElementById("paper-view").addEventListener("click", tvPaperView);
    document.getElementById("tv-weather-view").addEventListener("click", weatherView);
    document.getElementById("calcBtnTvBook").addEventListener("click", onCalc);
    document.getElementById("resetCalcTvBook").addEventListener("click", onResetCalc);
    document.getElementById("rename").addEventListener("click", onTvRename);
    document.getElementById("submitTvData").addEventListener("submit", onSubmitTvData)
}

const tvBookTemplate = document.createElement("div");
tvBookTemplate.setAttribute("id", "test");
tvBookTemplate.innerHTML = `
    <span id="dateBook">
            <p>Day</p>
        </span>
    
    <section class="input-wraper">
        <div class="input-container">
            <form id="tv-book-form" class="input">
                <textarea name="tvText" id="inputBookArea" class="tvText" placeholder="Paste your text here"></textarea>
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

        
    <form id="submitTvData" class="outputTvDate">
        <input type="text" name="day">
        <input type="text" name="date">
        <button class="submitAddTvData">submit</button>
    </form>
    <textarea id="responseMessage" class="responseMessage"></textarea>

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
    root.replaceChildren(paperTemplate);
    tvCalcValue = "paper";
}

function weatherView(event) {
    const allHrefs = document.querySelectorAll("a");
    allHrefs.forEach((x) => x.classList.remove("isActive"));
    event.currentTarget.classList.add("isActive");
    root.classList.remove("tv-book");
    body.classList.remove("tv-book");
    root.classList.add("weather");
    body.classList.add("weather");
    root.replaceChildren(weatherTemplate);
    document.getElementById("tv-book-view").addEventListener("click", tvBookView);
    document.getElementById("paper-view").addEventListener("click", tvPaperView);
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

const usd = currencyListArr[85].textContent;
const usdPref = currencyListArr[84].textContent;
const gbp = currencyListArr[22].textContent;
const gbpPref = currencyListArr[21].textContent;
const chf = currencyListArr[10].textContent;
const chfPref = currencyListArr[9].textContent;
const jpy = currencyListArr[43].textContent;
const jpyPref = currencyListArr[42].textContent;

document.write("Централен курс на БНБ: " + usd + "= " + usdPref + "; " + gbp + "= " + gbpPref + "; " + chf + "= " + chfPref + "; " + jpy + "= " + jpyPref)</textarea>
    <button id="exchangeRates" class="copyCode">Code copy</button>
`;

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

async function onTvRename() {
    try {
        const response = await fetch("http://localhost:5000/tv/rename", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        const result = await response.json();
        const message = document.getElementById("renamedTvMessage");
        message.textContent = result;
        message.style.display = "inline";

    } catch (error) {
        alert(`${error.message} \nThe server is probably not working!`);
    };
}

async function onSubmitTvData(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData);

    const days = [
        "Понеделник",
        "Вторник",
        "Сряда",
        "Четвъртък",
        "Петък",
        "Събота",
        "Неделя"
    ];

    if (!data.day || !data.date) {
        return alert("Day and date is required!");
    };

    if (!days.includes(data.day)) {
        return alert(`Ivalid day input: '${data.day}'!`);
    };

    const regex = /^\d\d.\d\d.\d\d\d\d$/

    const match = data.date.match(regex);

    if (!match) {
        return alert(`Ivalid date format! \n Should be: 'dd.mm.year' receive: '${data.date}'`);
    };

    const dateTokens = data.date.split(".");

    if (dateTokens[0] < 1 || dateTokens[0] > 31) {
        return alert(`Invalid day! \n Should be between 1 and 31 receive" '${dateTokens[0]}'`);
    };

    if (dateTokens[1] < 1 || dateTokens[1] > 12) {
        return alert(`Ivalid month! \n Should be between 1 and 12 receive: '${dateTokens[1]}'`);
    };

    const dataJSON = JSON.stringify(data);

    try {
        const response = await fetch("http://localhost:5000/tv/add", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: dataJSON
        });

        const result = await response.json();

        let reportMessage = result.join(",");
        reportMessage = reportMessage.replaceAll(",", "\n")

        const tvMessage = document.getElementById("responseMessage");

        tvMessage.value = reportMessage;

    } catch (error) {
        
        if (error.message === "Failed to fetch") {
            return alert(`${error.message}. \nThe server is probably not working!`);
        }
        
        alert(error.message);
    };
};
