
# Add Group


 _**Applies to:** Skype for Business 2015_

## Click to add group

The **personsAndGroupsManager** object exposes the **createGroup** method to make new group objects and we can set the name via the **name** property.  In this example we want to add the new group object into the **all** collection, but it would be possible to add this new group to another group creating a subgroup.  Calling **add** on the **groups** property of the **all** collection on **personsAndGroupsManager** should add our new group object.

```js
var groupName = content.querySelector('.groupName').value;
var group = application.personsAndGroupsManager.createGroup();
group.name(groupName);
application.personsAndGroupsManager.all.groups.add(group).then(function () {
    // group added successfully
}, function (error) {
    // handle error
}).then(reset);
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

