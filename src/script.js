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
    name: "Akash",
    timeZone: "Asia/Kolkata",
  },
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
  nameContainerElm.setAttribute("class", "font-bold text-gray-800");
  nameContainerElm.appendChild(document.createTextNode(contact.name));

//   const timeZoneElm = document.createElement("div");
//   timeZoneElm.setAttribute("class", "text-gray-600 text-sm");
//   timeZoneElm.appendChild(document.createTextNode(contact.timeZone));

  const timeElm = document.createElement("span");
  timeElm.setAttribute("class", "text-gray-700");
  timeElm.appendChild(document.createTextNode('Jan 1, 00:00 AM'));

  const nameAndDetailsContainerElm = document.createElement("div");
  nameAndDetailsContainerElm.appendChild(nameContainerElm);
//   nameAndDetailsContainerElm.appendChild(timeZoneElm);
  nameAndDetailsContainerElm.appendChild(timeElm);

  const containerElm = document.createElement("div");
  containerElm.setAttribute(
    "class",
    "rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center"
  );

  if(contact.self) {
    containerElm.classList.add('shadow-green-200');
    containerElm.classList.add('bg-green-300');
  } else {
    containerElm.classList.add('bg-white');
  }
  containerElm.setAttribute("id", formatedPersonName);

  containerElm.appendChild(imageContainerElement);
  containerElm.appendChild(nameAndDetailsContainerElm);

  return { element: containerElm, timeElement: timeElm, imageElement: imageElm };
}

contacts.unshift({ name: 'Me', timeZone: 'Asia/Kolkata', self: true}).element;

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

setInterval(updateContactCards, 1000);
