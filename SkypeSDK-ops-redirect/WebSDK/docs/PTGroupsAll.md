
# Retrieve All Groups


 _**Applies to:** Skype for Business 2015_

## Click to retrieve all groups

The **personAndGroupsManager** object exposes a group, **all**, which contains all persons and all groups.  Using this object we can get access to the **groups** collection and make a one-time call to **get** to retrieve information for all groups.  It would also be possible to retrieve all groups by calling **subscribe** on the **groups** collection and listening to the **added** event.

```js
// Notify search in progress
var groups = application.personsAndGroupsManager.all.groups;
groups.get().then(function (groups) {
    // updateUI(groups)
    // Groups search complete
}, function (error) {
    // handleError(error)
    // Groups search error
});
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

