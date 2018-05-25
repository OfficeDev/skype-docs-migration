
# Search for persons and distribution groups


 _**Applies to:** Skype for Business 2015_

A Person represents a user. The [Person](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html) object can be queried for information about a person, such as their availability to join a conversation. The [Person](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html) object is passed to the conversation starting methods, such as the [ConversationsManager.getConversation](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.conversationsmanager.html#getconversation) method, so that the conversation invitation is sent to the person represented by the [Person](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html) object.

A [Group](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.group.html) can represent a distribution group, server-defined person set, or user-defined person set. If the [Group](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.group.html) is a distribution group, it can also link to other distribution groups. Persons in a distribution group are represented by [Person](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html) objects. The arguments for the [PersonsAndGroupsManager.createGroupSearchQuery](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.personsandgroupsmanager.html#creategroupsearchquery) method include a partial or full name query and a numeric limit to the size of the result sets. Results include a collection of distribution groups. To find persons, use the [PersonsAndGroupsManager.createPersonSearchQuery](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.personsandgroupsmanager.html#createpersonsearchquery) method.
The following procedure assumes that a user has signed in before searching for persons and groups.

### Search for persons


1. Create a  **SearchQuery** for person search: **personsAndGroupsManager.createPersonSearchQuery**.
    
2. Specify the search terms in the  **SearchQuery**.
    
3. Execute the  **searchQuery.getMore** method and get the search **results** in the **onSuccess** method.
    
4. Call the  **forEach** method of the array of results. For each result, **Person** object is the result.result.
    
>**Note**:  The maximum number of results for a person search query is 50. 

  ```js
var personSearchQuery = application.personsAndGroupsManager.createPersonSearchQuery();
personSearchQuery.text('John Doe');
personSearchQuery.limit(50);
personSearchQuery.getMore().then(null, function (results) {
    results.forEach(function (result) {
        var person = result.result;
        person.avatarUrl.get().then(function (url) {
            console.log('The person`s photo: ' + url);
        });
        person.status.get().then(function (status) {
            console.log('The person`s online status: ' + status);
        });
    });
});

  ```


### Search for groups


1. Create a  **SearchQuery** for group search: **personsAndGroupsManager.createGroupSearchQuery**.
    
2. Specify the search terms in the  **SearchQuery**.
    
3. Execute the  **searchQuery.getMore** method and get the search **results** in the **onSuccess** method.
    
4. Call the  **forEach** method of the array of results. For each result, **Group** object is the **result.result**.


  ```js
var groupSearchQuery = application.personsAndGroupsManager.createGroupSearchQuery();
groupSearchQuery.text('mygroup');
groupSearchQuery.limit(50);
groupSearchQuery.getMore().then(null, function (results) {
    results.forEach(function (result) {
        var group = result.result;
        console.log('Distribution Group ', group.name());
    });
});

  ```


## Additional resources


- [Get a person and listen for availability](ListenForAvailability.md)
