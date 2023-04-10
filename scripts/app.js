'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

// main obj 
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        percent: document.querySelector('.progress__percent'),
        coverBar: document.querySelector('.progress__cover-bar'),
    },
    body: {
        daysContainer: document.getElementById('days'),
        day: document.querySelector('.habbit__day')
    }
};

// грех о сквернословие почитать

// utils
function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function requestJson (url) {
    let req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
        console.log(req.status)
        return req.response;

}
let answerDemo = requestJson('./data/demo.json');

function saveData(habbits) {
    localStorage.setItem(HABBIT_KEY, habbits);
}

// render 
function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if (!existed) {
            const elem = document.createElement('button');
            elem.setAttribute('menu-habbit-id', habbit.id);
            elem.classList.add('menu__item');
            elem.addEventListener('click', () => rerender(habbit.id));
            elem.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}">`
            if (activeHabbit.id === habbit.id) {
                elem.classList.add('menu__item_active');
            }
            page.menu.appendChild(elem);
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }
}

function rerenderHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 
    ? 100 
    : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.percent.innerText = progress.toFixed(0) + '%';
    page.header.coverBar.setAttribute('style', `width: ${progress}%`);
}

function rerenderContent(activeHabbit) {
    page.body.daysContainer.innerHTML = '';
    for (const index in activeHabbit.days) {
        const elem = document.createElement('div');
        elem.classList.add('habbit');
        elem.innerHTML = `
            <div class="habbit__day">День ${Number(index) + 1}</div>
            <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
            <button class="habbit__delete" type="button">
                <img src="./images/delete.svg" alt="delete ${index + 1}">
            </button>
        `;
        page.body.daysContainer.appendChild(elem);
    }
    page.body.day.innerHTML = `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if(!activeHabbit) {
        return;
    }
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

// init
(() => {
    saveData(answerDemo)
    loadData();
    rerender(habbits[0].id);
    // console.log(rerender());
})()