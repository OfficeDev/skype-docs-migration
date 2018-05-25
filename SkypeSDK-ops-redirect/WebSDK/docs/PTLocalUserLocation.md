
# Location


 _**Applies to:** Skype for Business 2015_

## Local user - Set Location

We can make use of the mePerson object exposed by personsAndGroupsManager and from this object get access to the location property.  This property is a writeable allowing changes via a set(...) method that takes a provided string.

### Provide a location and click to change location

```js
var mePerson = application.personsAndGroupsManager.mePerson;
mePerson.location.set(location).then(function () {
    // location changed succesfully 
}, function (error) {
    // handle error
});
```

#### Other resources

<a href="http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.meperson.html" target="">MePerson</a>
