let aryIannaTimeZones = Intl.supportedValuesOf("timeZone");
let contacts = [];
const contactsListElm = document.getElementById("contacts-list");

function loadContacts() {
  const storedContacts = localStorage.getItem('contacts');
  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
  } else {
    contacts = [
      {
        name: "Eldhose P Baby",
        timeZone: "Asia/Dubai",
      },
      {
        name: "Peter Devasia",
        timeZone: "America/Los_Angeles",
      },
      {
        name: "Akash Manoj",
        timeZone: "Asia/Kolkata",
      },
      {
        name: "Prince Elias George",
        timeZone: "America/Los_Angeles"
      },
      {
        name: "Lakshmipriya M",
        timeZone: "Europe/Copenhagen"
      }
    ];
  }
}

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

loadContacts();

let timeOffset = 0;
let selectedContact = null;

function getContactTimeCardHtml(contact) {
  const formatedPersonName = contact.name.toLowerCase().replaceAll(" ", "-");
  const imageContainerElement = document.createElement("div");
  const imageElm = document.createElement("img");
  imageElm.setAttribute("src", "img/moon.png");
  imageElm.setAttribute("class", "h-8 w-8 opacity-60");
  imageContainerElement.appendChild(imageElm);

  const nameContainerElm = document.createElement("div");
  nameContainerElm.setAttribute("class", "text-xl");
  nameContainerElm.appendChild(document.createTextNode(contact.name));

  const timeElm = document.createElement("span");
  timeElm.appendChild(document.createTextNode('Jan 1, 00:00 AM'));

  const nameAndDetailsContainerElm = document.createElement("div");
  nameAndDetailsContainerElm.appendChild(nameContainerElm);
  nameAndDetailsContainerElm.appendChild(timeElm);

  const containerElm = document.createElement("div");
  containerElm.setAttribute(
    "class",
    "rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center w-full sm:w-auto cursor-pointer relative"
  );

  if(contact.self) {
    containerElm.classList.add('shadow-green-200', 'dark:shadow-blue-900', 'bg-green-300', 'dark:bg-blue-900');
    nameContainerElm.classList.add('text-gray-800', 'dark:text-gray-100')
    timeElm.classList.add("text-gray-700", "dark:text-gray-200");
  } else {
    containerElm.classList.add('bg-white', 'dark:bg-gray-600');
    nameContainerElm.classList.add('text-gray-800', 'dark:text-gray-200')
    timeElm.classList.add("text-gray-700", "dark:text-gray-400");

    const removeButton = document.createElement('button');
    removeButton.setAttribute('class', 'absolute top-2 right-2 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 z-10');
    removeButton.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    removeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      contacts = contacts.filter(c => c.name !== contact.name);
      saveContacts();
      containerElm.remove();
    });
    containerElm.appendChild(removeButton);
  }
  containerElm.setAttribute("id", formatedPersonName);

  containerElm.appendChild(imageContainerElement);
  containerElm.appendChild(nameAndDetailsContainerElm);

  containerElm.addEventListener('click', () => {
    selectedContact = contact;
    const { hour, minute } = getTimeforTimezone(contact.timeZone);
    const timeInput = document.getElementById('edit-time-input');
    timeInput.value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    document.getElementById('edit-time-overlay').style.display = 'flex';
  });

  return { element: containerElm, timeElement: timeElm, imageElement: imageElm };
}

contacts.unshift({ name: 'Me', timeZone: 'Asia/Kolkata', self: true });

for (const contact of contacts) {
  const { element, timeElement, imageElement } = getContactTimeCardHtml(contact);
  contact.element = element;
  contact.timeElement = timeElement;
  contact.imageElement = imageElement;
  updateContactCard(contact);
  contactsListElm.appendChild(contact.element);
}

function updateContactCards() {
  for (const contact of contacts) {
    updateContactCard(contact);
  }
}

function updateContactCard(contact) {
  const { month, day, hour, minute, dayPeriod } = getTimeforTimezone(contact.timeZone);
  const displayHour = (hour % 12) || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  contact.timeElement.innerText = `${month} ${day}, ${displayHour}:${displayMinute} ${dayPeriod}`;
  const isNight = (dayPeriod === 'PM' && hour >= 7) || (dayPeriod === 'AM' && hour < 7);
  const dayNightImage = isNight ? 'img/moon.png' : 'img/sun.png';
  contact.imageElement.setAttribute('src', dayNightImage); 
}

function getTimeforTimezone(timeZone) {
  const now = new Date(new Date().getTime() + timeOffset);
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
    timeZone,
  });

  const parts = dateTimeFormat.formatToParts(now);
  const dateFormatted = {};

  for (const { type, value } of parts) {
    switch (type) {
      case "month":
      case "day":
      case "hour":
      case "minute": {
        dateFormatted[type] = value;
      }
    }
  }
  dateFormatted.dayPeriod = dateFormatted.hour >= 12 ? 'PM' : 'AM';

  return dateFormatted;
}

setInterval(updateContactCards, 30000);

const addNewPersonButton = document.getElementById("add-new-person");
const addNewPersonOverlay = document.getElementById("add-new-person-overlay");
const addNewPersonWindow = document.getElementById("add-new-person-window");
const addNewPersonForm = document.getElementById("add-new-person-form");
const newPersonTimezoneElm = document.getElementById("new-person-timezone");
const cancelModalButton = document.getElementById("cancel-modal-button");

for (const timeZone of aryIannaTimeZones) {
    const option = document.createElement("option");
    option.value = timeZone;
    option.innerText = timeZone;
    newPersonTimezoneElm.appendChild(option);
}

addNewPersonButton.addEventListener("click", () => {
    addNewPersonOverlay.style.display = "flex";
});

cancelModalButton.addEventListener("click", () => {
    addNewPersonOverlay.style.display = "none";
});

addNewPersonOverlay.addEventListener("click", (e) => {
    if (e.target === addNewPersonOverlay) {
        addNewPersonOverlay.style.display = "none";
    }
});

addNewPersonForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const timeZone = e.target.timezone.value;
    if (!name || !timeZone) {
        return;
    }
    const newContact = { name, timeZone };
    const { element, timeElement, imageElement } = getContactTimeCardHtml(newContact);
    newContact.element = element;
    newContact.timeElement = timeElement;
    newContact.imageElement = imageElement;
    contacts.push(newContact);
    saveContacts();
    updateContactCard(newContact);
    contactsListElm.appendChild(element);
    addNewPersonOverlay.style.display = "none";
    e.target.name.value = "";
    e.target.timezone.value = "";
});

const editTimeOverlay = document.getElementById('edit-time-overlay');
const editTimeForm = document.getElementById('edit-time-form');
const cancelEditTimeButton = document.getElementById('cancel-edit-time-button');

editTimeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTime = document.getElementById('edit-time-input').value;
  const [newHours, newMinutes] = newTime.split(':');

  const now = new Date(new Date().getTime() + timeOffset);
  const currentDateTime = new Date(
    now.toLocaleString('en-US', { timeZone: selectedContact.timeZone, hour12: false })
  );

  const newDateTime = new Date(currentDateTime);
  newDateTime.setHours(newHours);
  newDateTime.setMinutes(newMinutes);

  timeOffset += newDateTime.getTime() - currentDateTime.getTime();

  updateContactCards();
  editTimeOverlay.style.display = 'none';
});

cancelEditTimeButton.addEventListener('click', () => {
  editTimeOverlay.style.display = 'none';
});

editTimeOverlay.addEventListener('click', (e) => {
  if (e.target === editTimeOverlay) {
    editTimeOverlay.style.display = 'none';
  }
});
