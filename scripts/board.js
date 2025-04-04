const dataBase = "https://join---database-default-rtdb.europe-west1.firebasedatabase.app/test.json";
const cards = [];
const dialog = document.getElementById('overlay');
const wrapper = document.querySelector('.wrapper');
const todo = document.getElementById('to_do');
const progress = document.getElementById('progress');
const feedback = document.getElementById('feedback');
const done = document.getElementById('done');
let toDoMemory = ``;
let progressMemory = ``;
let feedbackMemory = ``;
let doneMemory = ``;


/**
 * Initializes the fetching
 */
async function init() {
    await fetchData();
    renderCards();
}


/**
 * This function fetches the cards from the database and call the function to push the data to an array
 */
async function fetchData() {
    try {
        let response = await fetch(dataBase);
        if(!response.ok) {
            throw new Error(`HTTP Fehler! Status: ${response.status}`);    
        }
        let data = await response.json();
        pushDataToCardsArray(data);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}


/**
 * This function converts the json to an iterable array of objects and pushes it to an empty array
 * 
 * @param {object} cardData - This is the fetched json from the database 
 */
function pushDataToCardsArray(cardData) {
    for(let [key, value] of Object.entries(cardData)) {
        if (key == "null") {
            continue;
        }
        cards.push({id : key, value});
    }
    console.log(cards);
}


/**
 * This function renders the task cards into the HTML
 */
function renderCards() {
    todo.innerHTML = ``;
    progress.innerHTML = ``;
    feedback.innerHTML = ``;
    done.innerHTML = ``;

    for (let i = 0; i < cards.length; i++) {
        checkRenderConditions(i);   
    }
    todo.innerHTML = toDoMemory;
    progress.innerHTML = progressMemory;
    feedback.innerHTML = feedbackMemory;
    done.innerHTML = doneMemory;
}


/**
 * This function checks in wich category the card belongs and saves the html code into the right variable
 * 
 * @param {number} index - The index of the current card
 */
function checkRenderConditions(index) {
    if (cards[index].value.currentStatus === "todo") {
        toDoMemory += getCardsTemplate(index);
    }
    else if (cards[index].value.currentStatus === "progress") {
        progressMemory += getCardsTemplate(index);
    }
    else if (cards[index].value.currentStatus === "feedback") {
        feedbackMemory += getCardsTemplate(index);
    }
    else if (cards[index].value.currentStatus === "done") {
        doneMemory += getCardsTemplate(index);
    }
}


/**
 * This function calculates the length of the subtasks for a card
 * 
 * @param {number} index - The index of the current card
 * @returns - returns the amount of subtasks in the card
 */
function getSubtasksInformation(index) {
    let subtaskLengthArr = [];
    let counter = 0;
    for (let [key, value] of Object.entries(cards[index].value.subtasks)) {
        if(key === "null") {
            continue;
        }
        subtaskLengthArr.push({id : key, value});
        if (value.status === "checked") {
            counter++;
        }
    }
    const progress = calculateProgressBar(counter, subtaskLengthArr);
    return getSubtasksTemplate(progress, counter, subtaskLengthArr.length);    
}


/**
 * This function calculates the % width for the progressbar
 * 
 * @param {number} counter - This counts the cheked tasks
 * @param {Array} subtaskLengthArr - This gives back the length of all subtasks
 * @returns - It returns the rounded percent for the progressbar
 */
function calculateProgressBar(counter, subtaskLengthArr) {
    if (counter === 0 && subtaskLengthArr.length === 0) {
        let progressbarPercent = 0;
        return progressbarPercent;
    }
    let calculatedAmount = counter / subtaskLengthArr.length * 100;
    let roundedAmount = Math.round(calculatedAmount);
    return roundedAmount;
}


/**
 * 
 * @param {number} index - The index of the current card
 * @returns - It return the first letters of the first and last name
 */
function getAssignedUsers(index) {
    let assignedContactsRef = ``;
    for(let [key, value] of Object.entries(cards[index].value.assigned)) {
        if (key == "null") {
            continue;
        }
        let [firstName, lastName] = value.name.split(" ");
        firstLetterFName = firstName.slice(0,1);
        firstLetterLName = lastName.slice(0,1);
        assignedContactsRef += getAssignedUsersTemplate(firstLetterFName, firstLetterLName);
    }
    console.log(assignedContactsRef);
    return assignedContactsRef;
}


/**
 * This function opens the dialog of the card
 */
function openDialog() {
    dialog.showModal();
}


/**
 * This function closes the dialog of the card
 */
function closeDialog() {
    dialog.close();
}


/**
 * This function closes the dialog if the user clicks next to the dialog
 * 
 * @param {*} e - resembles the event 
 */
dialog.onclick = function(e) {
    if(!wrapper.contains(e.target)) {
        dialog.close();
    }
}

















// Hab diese Funktion nur gebaut um Test Objekte in die Datenbank zu laden, lösche sie sobald alles glatt läuft


/*async function sendDataToFirebase(data) {
    await fetch("https://join---database-default-rtdb.europe-west1.firebasedatabase.app/test.json", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(data)
    });
}

function testUpload() {
    let obj = {
        "title" : "CSS Architecture Planning",
        "priority" : "medium",
        "duedate" : "20/06/2025",
        "description" : "Define CSS naming conventions and structure",
        "currentStatus" : "done",
        "category" : "Technical Task",
        "subtasks" : {"null" : "null"},
        "assigned" : {"null" : "null"}
    };
    sendDataToFirebase(obj);
}

testUpload();*/