
# Retrieve All Contacts


 _**Applies to:** Skype for Business 2015_

## Click to retrieve all Contacts

The personAndGroupsManager object exposes a group, all, which contains all persons and all groups.  Using this property we can get access to the persons collection and make a one-time request via Get() to retrieve information for all contacts.  It would also be possible to retrieve all persons by calling subscribe on the persons collection and listening to the added event.

```js
// Notify search in progress
var persons = application.personsAndGroupsManager.all.persons;
persons.get().then(function (contacts) {
    // Notify search complete
}, function (error) {
    // Notify search error
});
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

