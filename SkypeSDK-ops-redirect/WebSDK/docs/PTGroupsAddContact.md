
# Add Contact


 _**Applies to:** Skype for Business 2015_

## Click to add contact

A group object exposes a persons collection which allows us to add a contact, by SIP URI, to that group.  We get access to potential groups by subscribing to the **groups** collection of the **all** property found on the **personsAndGroupsManager** object and adding an event listener for the **added** event.  In some cases a name property may not be readily available so we can listen to the **changed** event of the **name** property to be certain we have the value.

```js
application.personsAndGroupsManager.all.groups.subscribe();
application.personsAndGroupsManager.all.groups.added(function (group) {
    group.name.get();
    group.name.changed(function (value) {
        if (!groups[value] && group.type() !== 'Distribution') {
            var option = document.createElement('option');
            option.value = value;
            option.innerHTML = value;
            content.querySelector('.groupsSelect').appendChild(option);
            groups[value] = group;
        }
    });
});
var id = content.querySelector('.id').value;
var group = groups[content.querySelector('.groupsSelect option:checked').value];
group.persons.add(id).then(function () {
    // person added successfully
}, function (error) {
    // handle error
}).then(reset);
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

