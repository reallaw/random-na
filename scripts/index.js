const headerLogo = document.querySelector('.header__logo');
const spanTitle = document.querySelector('.main__title-span');
const inputsList = Array.from(document.querySelectorAll('.main__input'));
const inputSelectClass = document.querySelector('#selectClass');
const inputIgnoreNums = document.querySelector('#ignoreNumsInput');
const checkboxRepeatNums = document.querySelector('.main__checkbox');
const checkboxLabel = document.querySelector('#checkboxLabel');
const result = document.querySelector('.main__result');
const cursor = document.querySelector('.main__cursor');
const btnGenerate = document.querySelector('.main__button');
const errorSound = document.querySelector('#error-sound');
const notificationSound = document.querySelector('#notification-sound');
const phrasesList = [`Поднимал(а) руку`, `Желает получить 2-ку`, `Заучил(а) мат. часть`, `К ответу готов(а)`, `Успел(а) прочитать параграф`, `Обожает предмет`, `Предпочитает ответить`, `Несомненно подготовился(ась)`, `Пару часов учил(а) материал`, `Не сделал(а) ДЗ...`, `Перепутал(а) sin с cos`];
let noRepeatNums = '';
let sysSpeed = 225;
let sysGen = 0;

if (localStorage.getItem('class') === null || localStorage.getItem('absentList') === null) {
    localStorage.class = `8 "Д"`;
    localStorage.absentList = "";
}

if (localStorage.getItem('class') !== null) {
    inputSelectClass.value = `${localStorage.getItem('class')}`;
} else {
    inputSelectClass.value = `8 "Д"`;
}

if (localStorage.getItem('inputAbsentList') !== '""') {
    const inputAbsentList = localStorage.getItem('absentList').split('"').join('').trim();
    inputIgnoreNums.value = `${inputAbsentList}`;
} else {
    inputIgnoreNums.value = "";
}

for (let i = 0; students8Д.length !== i; i++) {
    students8Д[i]['posIndex'] = i + 1;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function getClass(evtClass) {
    let selectClassValue = inputSelectClass.value.toUpperCase();
    
    if (selectClassValue === '8 Д' || selectClassValue === '8 "Д"' || selectClassValue === '8Д') {
        setResult(students8Д, inputIgnoreNums, noRepeatNums);
        inputsList.forEach(element => {
            element.setAttribute('disabled', '');
        });
    } else {
        errorSound.play();
        doErrorResponse(inputSelectClass);
    };
};

async function doErrorResponse (item) {
    errorSound.play();
    for (let i = 0; 10 !== i; i++) {
        await sleep(82,5);
        item.setAttribute('style', 'transform: translate(10px, 0); box-shadow: 0px 0px 0px 3px rgba(231, 46, 66, 0.75), 0px 0px 8.75px rgba(231, 46, 66, 0.75);');
        await sleep(82,5);
        item.setAttribute('style', 'transform: translate(-10px, 0); box-shadow: 0px 0px 0px 3px rgba(231, 46, 66, 0.75), 0px 0px 8.75px rgba(231, 46, 66, 0.75);');
    };
    item.removeAttribute('style');
};

function keyHandler(evt) {
    if (evt.key === 'Delete' || evt.key === 'Backspace' || !Number.isNaN(Number(evt.key))) {
        console.log('Введен/удален символ');
    } else if (evt.key === 'Enter') {
        if (checkboxRepeatNums.hasAttribute('checked')) {
            getClass();
        };
    } else {
        evt.preventDefault();
    }
};

function generateResult(list) {
    let i = Math.floor(Math.random() * list.length);
    return i;
};

function generateList(primaryList, secondaryList, thirdList) {
    let newList = NaN;
    thirdList = typeof thirdList !== 'undefined' ?  thirdList : '';
    if (thirdList) {
        newList = Array.from(secondaryList.value.split(' ').concat(thirdList.split(' ')));
    } else {
        newList = Array.from(secondaryList.value.split(' '));
    };
    let coppiedList = Object.assign([], primaryList); /* Копия списка */
    newList.forEach(element => { /* Проходимся по каждому числу в newList */
        for (let i = 0; i !== coppiedList.length; i++) {
            if (element && element >= 1 && element <= primaryList.length && coppiedList[i].name === primaryList[element - 1].name) {
                coppiedList = coppiedList.slice().splice(0, i).concat(coppiedList.slice().splice(i + 1));
                break;
            };
        };
    });
    return coppiedList;
};

spanTitle.textContent = inputSelectClass.value;

function typeText(val) {
    let line = 0;
    let count = 0;
    let isSpace = 0;
    let space = '';

    function typeLine(val) {
        let interval = setTimeout(async function () {
            space += val[line][count];
            result.textContent = space;
            count ++;
            if (count >= val[line].length) {
                count = 0;
                line++;
                if (val[line] == ' ' && isSpace == 0) {
                    await sleep(1750);
                    isSpace = 1;
                };
                if (line == val.length) {
                    clearTimeout(interval);
                    result.textContent = space;
                    return true;
                }
            }
            typeLine(val);
        }, sysSpeed / 3);
    }

    typeLine(val);
};

async function setResult(mainList, mainInput) {
    let inptSelectClassVal = inputSelectClass.value
    if (spanTitle.textContent != inptSelectClassVal) {
        notificationSound.play();
        smoothly(spanTitle, 'textContent', inptSelectClassVal);
    };
    btnGenerate.setAttribute('disabled', '');
    coppiedList = generateList(mainList, mainInput, noRepeatNums);
    let index = generateResult(coppiedList);
    localStorage.class = inputSelectClass.value;
    localStorage.absentList = JSON.stringify(inputIgnoreNums.value);
    if (result.hasAttribute('style')) {
        result.removeAttribute('style');
    };
    if (!inputIgnoreNums.hasAttribute('disabled')) {
        inputsList.forEach(element => {
            element.setAttribute('disabled', '');
        });
    };
    if (coppiedList.length == 0) {
        errorSound.play();
        result.textContent = `Значение неизвестно.`;
    } else if (sysGen == 0) {  
        cursor.classList.add('main__cursor_hidden');
        for (let i = 0; i !== index + 1; i++) {
            let student = coppiedList[i].name;
            if (coppiedList[i].surname) {
                student = `${coppiedList[i].surname} ${coppiedList[i].name}`;
            }
            result.setAttribute('style', 'opacity: 0');
            await sleep(sysSpeed)
            result.textContent = `${student} (${coppiedList[i].posIndex})`;
            result.setAttribute('style', 'opacity: .325');
            await sleep(sysSpeed - 50);
        };
    } else /* (sysGen == 1) */ {
        let phraseIndex = generateResult(phrasesList);
        smoothly(result, 'textContent', phrasesList[phraseIndex]);
        cursor.classList.remove('main__cursor_hidden');
        await sleep(sysSpeed * 10);
        console.log(coppiedList[index]);
        typeText(`${coppiedList[index].name} ${coppiedList[index].surname} (${coppiedList[index].posIndex})`);
    };
    console.log(coppiedList)
    if (checkboxRepeatNums.hasAttribute('checked')) {
        noRepeatNums += `${coppiedList[index].posIndex} `;
    };
    result.removeAttribute('style');    
    btnGenerate.removeAttribute('disabled', '');
    inputsList.forEach(element => {
        element.removeAttribute('disabled', '');
    });
};

headerLogo.addEventListener('dblclick', function(){
    let result = prompt('Введите код доступа:');
    if (result === '16384') {
        notificationSound.play();
        console.log("Успешный вход. (5AA)"); /* шестнадцатиричная система */
        sysGen = Number(prompt('Введите цифру, где 0 - базовая система и 1 - нестандартная.'));
        console.log(sysGen)
        sysSpeed = Number(prompt('Введите число в МС, определеяющее скорость смены текста в системе.'));
    } else {
        alert("Неверный код доступа.");
    };
});
inputSelectClass.addEventListener('keydown', function(evt){
    if (evt.key === 'Enter') {
        getClass();
    } else {

    };
});
inputIgnoreNums.addEventListener('keydown', keyHandler);
checkboxLabel.addEventListener('click', async function(){
    if (checkboxRepeatNums.hasAttribute('checked')) {
        noRepeatNums = ``;
    };
    checkboxRepeatNums.toggleAttribute('checked');
});
btnGenerate.addEventListener('click', function(evt){
    evt.preventDefault();
    getClass();
});