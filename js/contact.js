let names = [];
let emails = [];
let phones = [];

async function contactMain() {
  names = [];
  emails = [];
  phones = [];
  await loadContacts();
  let contactMain = document.getElementById("ContactMain");
  contactMain.innerHTML = "";

  for (let i = 0; i < names.length; i++) {
    contactMain.innerHTML += getContactMain(i);
  }
  contactMain.innerHTML += getAddContactBtn();
}

async function loadContacts() {
  let loadContacts = await getContacts();
  let contactsArray = Object.values(loadContacts);

  for (let index = 0; index < contactsArray.length; index++) {
    emails.push(contactsArray[index].email);
    names.push(contactsArray[index].name);
    phones.push(contactsArray[index].phone);
  }
  await sortContacts();
}

function getContactMain(i) {
  return `
    <div id="idNameMailshort" onclick="openContact(${i})">
        <div id="idShortName">
            <p id="idShortAlph">MM</p>
        </div>
        <div id="idNameMail">
            <p id="idName">${names[i]}</p>
            <p id="idMail">${emails[i]}</p>
        </div>
    </div>
    `;
}

function getAddContactBtn() {
  return `
    <div id="idAddContact" onclick="addContact()">
    <img id="idImgAddContact" src="assets/img/svg/person_add.svg" alt=""></div>
    `;
}

function addContact() {
  let addContact = document.getElementById("ContactMain");
  addContact.innerHTML += getaddContact();
}

function getaddContact() {
  return `
    <div>
        <div>
            <img src="assets/img/svg/close.svg" alt="x" onclick="contactMain()">
            <h1>Add contact</h1>
            <h3>Tasks are better with a team!</h3>
            <div id="blueline"><div>
        </div>
        <img>
        <div>
            <div>
                <input type="text" name="name" placeholder="Name">
                <input type="email" name="email" placeholder="Email">
                <input type="Tel" name="phone" placeholder="Phone">
            </div>
            <div onclick="submitAddContact()">
                <p>Create Contact</p>
                <img alt="check">
            </div>
        </div>
    </div>
    `;
}

async function sortContacts() {
  let contacts = names.map((name, index) => ({
    name,
    email: emails[index],
    phone: phones[index],
  }));

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  names = contacts.map((contact) => contact.name);
  emails = contacts.map((contact) => contact.email);
  phones = contacts.map((contact) => contact.phone);
}

function openContact(i) {
  let openContact = document.getElementById("ContactMain");
  openContact.innerHTML = "";
  openContact.innerHTML += getContactView(i);
}

function getContactView(i) {
  return `
    <div id="idContactView">
        <div id="idheadContactView">
        <h1 id="idh1Contacts">Contacts</h1> 
        <img src="assets/img/svg/arrow-left-line.svg" alt="return" onclick="contactMain()">
        </div>
        <h3>Better with a team</h3>
        <div id="idblueLine"></div>
            <div id="idShortName">
                <p id="idShortAlph">MM</p>
            </div>
            <h1>${names[i]}</h1>
            <h3>Contact Information</h3>
            <h3>Email</h3>
            <p id="idMail">${emails[i]}</p>
            <h3>Phone</h3>
            <p>${phones[i]}</p>
            <div id="idEditDeleteBtn">
                <img src="assets/img/svg/more_vert.svg" alt="editContact" onclick="editContactBtn(${i})">
            </div>
    </div>
    `;
}

function editContactBtn(i) {
  let editContactBtn = document.getElementById("idEditDeleteBtn");
  editContactBtn.innerHTML += getEditContactBtn(i);
}

function getEditContactBtn(i) {
  return `
    <div>
        <div onclick="editContact(${i})">
            <img alt="pencil">
            <p>Edit</p>
        </div>
        <div onclick="deleteContact()">
            <img alt="bin">
            <p>Delete</p>
        </div>
    </div>
    `;
}

function editContact(i) {
  let editContact = document.getElementById("ContactMain");
  editContact.innerHTML += getEditContact(i);
}

function getEditContact(i) {
  return `
    <div>
        <h1>Edit contact</h1><img alt="return" onclick="contactMain()">
        <div id="idblueLine"></div>
            <div id="idShortName">
                <p id="idShortAlph">MM</p>
            </div>
            <div>
                <input value="${names[i]}" type="text" name="name" placeholder="Name">
                <input value="${emails[i]}" type="email" name="email" placeholder="Email">
                <input value="${phones[i]}" type="Tel" name="phone" placeholder="Phone">
            </div>
            <h1>${names[i]}</h1>
            <h3>Contact Information</h3>
            <h3>Email<h3>
            <p id="idMail">${emails[i]}</p>
            <h3>Phone<h3>
            <p>${phones[i]}</p>
            <div id="idDeleteBtn" onclick="deleteContact()">
            <p>Delete</p>
            </div>
            <div id="idSaveBtn" onclick="saveContact()">
                <p>Save</p>
                <img alt="saveContact" >
            </div>
    </div>
    `;
}

function submitAddContact() {
  console.log("Submit new Contact in Progress");
}

function notifSucess() {
  return `
    <div>
    <p>Contact successfully created</p>
    </div>
    `;
}

function deleteContact() {
  console.log("Delete Contact in Progress");
}

function saveContact() {
  console.log("Save Contact in Progress");
}
