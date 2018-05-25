
# Rename Group


 _**Applies to:** Skype for Business 2015_

## Click to rename a group

Group objects have a **name** property that can be set to trigger a rename operation.  Depending on the contact storage, either the existing group will be removed and a new group created or the existing group will be renamed.  Only custom user-created groups can be renamed.

```js
var groupOption = content.querySelector('.groupsSelect option:checked');
var groupName = (content.querySelector('.groupName')).value;
var group = groups[groupOption.value];

group.name.set(groupName).then(() => {
    // group renamed successfully
}, error => {
    // handle error
    });
```

## Additional resources

- <a href="https://msdn.microsoft.com/skype/websdk/docs/ListenForAvailability" target="">Get a person and listen for availability</a>

