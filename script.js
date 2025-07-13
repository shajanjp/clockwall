let aryIannaTimeZones = Intl.supportedValuesOf("timeZone");
let contacts = [
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
const contactsListElm = document.getElementById("contacts-list");

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

//   const timeZoneElm = document.createElement("div");
//   timeZoneElm.setAttribute("class", "text-gray-600 text-sm");
//   timeZoneElm.appendChild(document.createTextNode(contact.timeZone));

  const timeElm = document.createElement("span");
  timeElm.appendChild(document.createTextNode('Jan 1, 00:00 AM'));

  const nameAndDetailsContainerElm = document.createElement("div");
  nameAndDetailsContainerElm.appendChild(nameContainerElm);
//   nameAndDetailsContainerElm.appendChild(timeZoneElm);
  nameAndDetailsContainerElm.appendChild(timeElm);

  const containerElm = document.createElement("div");
  containerElm.setAttribute(
    "class",
    "rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center w-full sm:w-auto"
  );

  if(contact.self) {
    containerElm.classList.add('shadow-green-200', 'dark:shadow-blue-900', 'bg-green-300', 'dark:bg-blue-900');
    nameContainerElm.classList.add('text-gray-800', 'dark:text-gray-100')
    timeElm.classList.add("text-gray-700", "dark:text-gray-200");
  } else {
    containerElm.classList.add('bg-white', 'dark:bg-gray-600');
    nameContainerElm.classList.add('text-gray-800', 'dark:text-gray-200')
    timeElm.classList.add("text-gray-700", "dark:text-gray-400");
  }
  containerElm.setAttribute("id", formatedPersonName);

  containerElm.appendChild(imageContainerElement);
  containerElm.appendChild(nameAndDetailsContainerElm);

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
  contact.timeElement.innerText = `${month} ${day}, ${hour}:${minute} ${dayPeriod}`;
  const isNight = (dayPeriod === 'PM' && parseInt(hour) >= 7) || (dayPeriod === 'AM' && parseInt(hour) < 7);
  const dayNightImage = isNight ? 'img/moon.png' : 'img/sun.png'
  contact.imageElement.setAttribute('src', dayNightImage); 
}

function getTimeforTimezone(timeZone) {
  const now = new Date();
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });

  const parts = dateTimeFormat.formatToParts(now);
  const dateFormatted = {};

  for (const { type, value } of parts) {
    switch (type) {
      case "month":
      case "day":
      case "hour":
      case "minute":
      case "dayPeriod": {
        dateFormatted[type] = value;
      }
    }
  }

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
    updateContactCard(newContact);
    contactsListElm.appendChild(element);
    addNewPersonOverlay.style.display = "none";
    e.target.name.value = "";
    e.target.timezone.value = "";
});
