
# Display Contact Card


 _**Applies to:** Skype for Business 2015_

## Provide a SIP URI or contact name to see expanded info

With a Person object it is possible to retrieve additional information such as department, title, company, email addresses, phone numbers, and SIP URI among other information.  With this information we will build a simple contact card displaying additional information about a contact.  In this example we re-use logic from contact search and limit the results to a single contact and build a simple table containing the extra information.

```js
function addContactCardDetail(item, value, cardContainer) {
    const detailDiv = document.createElement('div');
    detailDiv.innerHTML = item + ": " + value;
    cardContainer.appendChild(document.createElement('br'));
    cardContainer.appendChild(detailDiv);
}

function createContactCard(contact, container) {
    const contactCardDiv = document.createElement('div');
    contactCardDiv.className = 'contactCard table';
    container.appendChild(document.createElement('br'));
    container.appendChild(contactCardDiv);
    contact.department() && addContactCardDetail('Department', contact.department(), contactCardDiv);
    contact.company() && addContactCardDetail('Company', contact.company(), contactCardDiv);
    contact.emails().length !== 0 && addContactCardDetail('Email Address', contact.emails()[0].emailAddress(), contactCardDiv);
    contact.id() && addContactCardDetail('IM', contact.id(), contactCardDiv);
    contact.phoneNumbers().length !== 0 && addContactCardDetail('Phone Number', contact.phoneNumbers()[0].displayString(), contactCardDiv);
}

function populateContacts(contacts, container) {
    function populateSingleContact(contact) {
        // some of the properties you can access contact.displayName(), contact.note().text, contact.avatarUrl()
        processing = false;
    }
    function loopOverAllContacts() {
        if (processing) {
            return;
        }
        processing = true; i++;
        if (i == contacts.length) {
            clearInterval(loopOverAllContacts);
            return;
        }
        var contact = contacts[i].result ? contacts[i].result : contacts[i];
        if (contact.type && contact.type() == 'Phone') {
            populateSingleContact(contact);
        } else {
            // do an explict get on one property to fetch all properties
            contact.status.get().then(function () {
                populateSingleContact(contact);
            });
        }
    }
    var processing = false, i = -1;
    setInterval(loopOverAllContacts, 10);
}

var content = document.querySelector('.content')

const search = application.personsAndGroupsManager.createPersonSearchQuery();
search.text('John Doe');
search.limit(1);
search.getMore().then(() => {
    reset();
    const contacts = search.results();
    if (contacts.length !== 0) {
        contactsDiv.style.display = 'block';
        populateContacts(search.results(), contactsDiv);
        createContactCard(search.results()[0].result, content.querySelector('.contactcard'));
        // successfully found contact 
    } else {
        // handle error
    }
}, error => {
    // handle error
});
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>
