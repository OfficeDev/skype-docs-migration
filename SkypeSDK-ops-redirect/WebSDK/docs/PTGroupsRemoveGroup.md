
# Remove Group


 _**Applies to:** Skype for Business 2015_

## Click to remove group

The **personAndGroupsManager** object exposes a group, **all**, which contains all persons and all groups.  In order to remove a group from a user's contacts, we call the **remove** method of this **groups** collection, and supply a group name or group object. In this example we populate an array called **addedGroups** containing groups that can be removed indexed by their names.  When the group is successfully removed a **removed** event will be emitted for the **groups** collection.

```js
application.personsAndGroupsManager.all.groups.subscribe();
application.personsAndGroupsManager.all.groups.added(group => {
    group.name.get();
    group.name.changed(value => {
        addedGroups[value] = group;
    });
});

var groupOption = content.querySelector('.groupsSelect option:checked');
var group = addedGroups[groupOption.value];

application.personsAndGroupsManager.all.groups.remove(group).then(function () {
    // group successfully removed
}, function (error) {
    // handle error
});
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

