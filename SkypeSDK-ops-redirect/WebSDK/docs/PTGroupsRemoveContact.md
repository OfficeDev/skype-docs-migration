
# Remove Contact


 _**Applies to:** Skype for Business 2015_

## Click to remove contact

A group object exposes a **persons** collection which allows us to add a contact, by SIP URI, to that group.  We get access to potential groups by subscribing to the **groups** collection of the **all** property found on the **personsAndGroupsManager** object and adding an event listener for the **added** event.  In some cases a **name** property may not be readily available so we can listen to the **changed** event of the **name** property to be certain we have the value.

```js
application.personsAndGroupsManager.all.persons.subscribe();
application.personsAndGroupsManager.all.persons.added(person => {
    person.displayName.get();
    person.displayName.changed(value => {
        const option = document.createElement('option');
        const name = person.displayName();
        option.value = name;
        option.innerHTML = name;
        content.querySelector('.personsSelect').appendChild(option);
        persons[name] = person;
    });
});

var personOption = content.querySelector('.personsSelect option:checked');
var person = persons[personOption.value];
application.personsAndGroupsManager.all.persons.remove(person).then(function () {
    // removed person successfully
}, function (error) {
    // handle error
}).then(reset);
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

