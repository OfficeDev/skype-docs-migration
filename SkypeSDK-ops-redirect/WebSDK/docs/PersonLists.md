
# Person Lists


 _**Applies to:** Skype for Business 2015_

The Application object in Skype Web SDK contains persons and groups collections, which contain a user's persons and person groups respectively. A [Person](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html) is a logical representation of a person and a person group is a logical grouping of a user's person list people.


## Person lists

The person list objects in Skype Web SDK support several views of a user's persons. You can show a flat list of persons and sort the list view to meet app requirements. You can show a list by person group with group members listed for each group. You can also show a person list organized around the privacy relationship that a user sets for each person in the list. Figure 1 shows how Skype Web SDK person list objects are accessed to build these views. 

Notice that the connector in figure 1 shows relationships between the groups collection and the parent person group. An application uses this connection to show distribution groups in a person list. 


**Figure 1. Skype Web SDK objects that encapsulate a user's person list**

![SkypeWebSDK_PersonListObjectmodel](../images/1168c6b2-e49a-435c-9233-d5d1695ed605.png)
### Person list ordered by person

This combines the person memberships of all of the user's person groups into one view. Each person in the list is represented only once, even if they are a member in multiple groups. Use the  **PersonsAndGroupsManager.all.persons** collection to get the person list. Lists are dynamic because a user can add or remove people from her person list at any time. The **persons** collection provides a set of events that you can listen to if you want to keep a person list view current..


### Person list ordered by group

Use the  **PersonsAndGroupsManager.all.groups** collection to show a view of the groups in a user's person list. For each group, you can show the person membership. Any distribution groups in a user's person list are a special case of group. Distribution groups can contain other distribution groups in addition to persons. You can add a feature that lets a user expand a distribution group in list view to show any persons or another level of distribution group nesting. The **PersonsAndGroupsManager.all.groups** collection exposes events that are raised when a user creates a new custom group or removes a custom group. An individual Group has events for membership changes and property changes such as an update to the **Group.name** property.


## Person list ordered by relationship

A group of persons set to a specific privacy relationship are represented by a Group object. The person membership collection of a privacy relationship group can change. For this reason, you should handle the membership change events on a privacy relationship group. 


## See also


#### Concepts


[Get a person and listen for availability](ListenForAvailability.md)  
[Manage persons and groups](ManagePersonsAndGroups.md)
