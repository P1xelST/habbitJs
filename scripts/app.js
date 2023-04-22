'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let trackerActiveHabbitId;

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
    },
    popup: {
        toggle: document.querySelector('.cover'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
};

// грех о сквернословие почитать

// utils

function requestJson(url) {
    // let req = new XMLHttpRequest();
    // req.open('GET', url);
    // req.setRequestHeader('Content-Type', 'application/json');
    // req.send();
    // req.onload = () => {
    //     let data = req.response;
    //     if (req.statusText === "OK") {
    //         localStorage.setItem(HABBIT_KEY, data);
    //     } else {
    //         throw 'sad';
    //     }
    // };

    getResource(url)
    // .then(data => data.json())
    .then(data => JSON.stringify(data))
    .then(data => {
        localStorage.setItem(HABBIT_KEY, data);
    })
    .catch(function(e) {
        console.log(`oblom ${e}}`)
    })
    
}

async function getResource(url) {
    const req = await fetch(`${url}`);
    if (!req.ok) {
        throw new Error(`could not fetch ${url}, status: ${req.status}`)
    }
    return await req.json();
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}
function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
    // console.log(habbits)
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
            <button class="habbit__delete" type="button" onclick="deleteDay(${index})">
                <img src="./images/delete.svg" alt="delete ${index + 1}">
            </button>
        `;
        page.body.daysContainer.appendChild(elem);
    }
    page.body.day.innerHTML = `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
    trackerActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if(!activeHabbit) {
        return;
    }
    console.log(activeHabbit)
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

// formData Days
function addDays(event) {
    event.preventDefault();
    const form = event.target;
    console.log(form);
    const data = new FormData(form); //formData Api
    // console.log(data.get('comment')); способ получения значения элемента value or name
    const comment = data.get('comment');
    form['comment'].classList.remove('error');
    if(!comment) {
        form['comment'].classList.add('error');
        return false
    }
    habbits = habbits.map(habbit => {
        if (habbit.id === trackerActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{comment}])
            };
        }
        return habbit;
    })
    form['comment'].value = '';
    rerender(trackerActiveHabbitId);
    saveData();
}

function deleteDay(index) {
    // console.log(habbits)
    habbits = habbits.map(habbit => {
        if (habbit.id === trackerActiveHabbitId) {
            habbit.days.splice(index, 1);
            return {
                ...habbit,
                days: habbit.days
            };
        } else {
            return habbit;
        }
    })
    rerender(trackerActiveHabbitId);
    saveData()
}


// togglePopup 
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        togglePopup()
    }
})

function togglePopup() {
    page.popup.toggle.classList.toggle('cover_hidden')
}
sessionStorage.setItem('asd', 'adadsdada');

// working with habits
function setIcon(context, iconValue) {
    page.popup.iconField.value = iconValue;
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
    context.classList.add('icon_active')
}

// init
(() => {
    requestJson('./data/demo.json');
    loadData(); 
    rerender(habbits[0].id);
})()