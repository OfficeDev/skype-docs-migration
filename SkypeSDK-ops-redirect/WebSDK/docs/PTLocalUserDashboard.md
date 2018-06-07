
# Load Dashboard


 _**Applies to:** Skype for Business 2015_

## Local user


### Using the mePerson object

The <a href="http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.meperson.html" target="">MePerson</a> object is retrieved through the **<a href="http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.application.html" target="">application</a>.<a href="http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.personsandgroupsmanager.html#meperson" target="">personsAndGroupsManager.mePerson</a>** property. For example, the following JavaScript code sample sets the availability of the signed in user to online.


```js
// tell the mePerson to change the availability state

app.personsAndGroupsManager.mePerson.status.set('Online').then(function () {
    alert('The status of mePerson has been changed');
}).then(null, function (error) {
    // and if could not be changed, report the failure
    alert(error || 'The server has rejected this availability state.');
});
```

<a href="http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.meperson.html" target="">MePerson</a> properties which can be set


|||
|:-----|:-----|
|**Property**|**Description**|
|location|Gets or sets the location of the signed in user.|
|note.text|Gets or sets the personal note of the signed in user.|
|status|Gets or sets the availability of the signed in user.|
>**Note:** When the above values contain special characters such as <, >, and they will be padded with zero width whitespace. This can cause equality operations to fail unexpectedly. One option for handling this situation is to filter out these special values so they are not used.

<a href="http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.meperson.html" target="">MePerson</a> properties which are read-only


|||
|:-----|:-----|
|**Property**|**Description**|
|department|Gets the work department of the signed in user.|
|email|Gets the primary email address of the signed in user.|
|emails|Gets the email addresses associated with the signed in user.|
|displayName|Gets the display name of the signed in user.|
|avatarUrl|Gets the photo URL of the signed in user.|
|title|Gets the business title of the signed in user.|
|id|Gets the SIP URI of the signed in user.|

```js
function addContactCardDetail(item, value, cardContainer) {
    const detailDiv = document.createElement('div');
    detailDiv.innerHTML = item + ": " + value;
    cardContainer.appendChild(document.createElement('br'));
    cardContainer.appendChild(detailDiv);
}

function createContactCard(contact, container) {
    contact.company.get().then(function () {
        var contactCardDiv = document.createElement('div');
        contactCardDiv.className = 'contactCard table';
        container.appendChild(document.createElement('br'));
        container.appendChild(contactCardDiv);
        contact.displayName() && addContactCardDetail('Name', contact.displayName(), contactCardDiv);
        contact.company() && addContactCardDetail('Company', contact.company(), contactCardDiv);
        contact.department() && addContactCardDetail('Department', contact.department(), contactCardDiv);
        contact.id() && addContactCardDetail('IM', contact.id(), contactCardDiv);
        contact.emails().length !== 0 && addContactCardDetail('Email', contact.emails()[0].emailAddress(), contactCardDiv);
        contact.phoneNumbers().length !== 0 && addContactCardDetail('Phone', contact.phoneNumbers()[0].displayString(), contactCardDiv);
    });

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

// retrieve local user details
const mePerson = application.personsAndGroupsManager.mePerson;
const contactsDiv = content.querySelector('.contacts');
const mePersonArray = []; 
mePersonArray.push(mePerson);
contactsDiv.innerHTML = '';
populateContacts(mePersonArray, contactsDiv);
createContactCard(mePerson, contactsDiv.querySelector('.contact'));
```

#### Concepts



<a href="//msdn.microsoft.com/skype/websdk/docs/ptcontactscontactcard" target="">Show a person's information</a>
#### Other resources


<a href="//officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.meperson.html" target="">MePerson</a>
