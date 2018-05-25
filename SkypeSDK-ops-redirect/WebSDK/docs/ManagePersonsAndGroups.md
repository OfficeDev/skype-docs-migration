
# Manage persons and groups


 _**Applies to:** Skype for Business 2015_

 **In this article**  
[Create a new user-defined group](#sectionSection1)  
[Rename a Group](#sectionSection2)  
[Delete a Group](#sectionSection3)  
[Add a Person to a Group](#sectionSection4)  
[Remove a Person from a Group](#sectionSection5)  


The Skype Web SDK provides APIs to manage groups and persons. Basic functionalities related to groups include:

- Creating a new user-defined group
    
- Renaming a user-defined group
    
- Deleting a user-defined group
    
- Adding a distribution group to the groups list
    
- Removing a distribution group from the groups list
    
Basic functionalities related to persons include:

- Adding a person to a group
    
- Removing a person from a group
    

>**Note**  It is allowed to add or remove a person to or from user-defined groups or special groups, such as the default group (Other Contacts) and the pinned group (Favorites). However, such operations are not allowed on distribution groups or privacy-related groups.

All of these operations involve sending a request to the server and dealing with the response. The server will emit related events when the operation is completed. Usually such events will be received later than the response. It is important for the client to listen to these events and treat them as final indications of successful operations and to update the UI component accordingly.

## Create a new user-defined group
<a name="sectionSection1"> </a>

With a  **Client** object that is already signed in:


1. Create a new **Group** object. 
    

  ```js
  var g = client.personsAndGroupsManager.createGroup();
  ```


 >**Note**  At this point the group has not been created on the server so operations, such as adding a person to the group, are not enabled until **groups.add** is called.

2. Set the group name.
    

  ```js
  g.name('Group Name');
  ```

3. Add the group. (You can optionally check if this operation is enabled.)
    

  ```js
if(client.personsAndGroupsManager.all.groups.add.enabled())
	client.personsAndGroupsManager.all.groups.add(g).then(
		createGroupSuccess, createGroupFail);

  ```


 >**Note**   The **add** API can also be used to add a distribution group to the groups list. You can do this by searching for a distribution group, and passing the **Group** object found to the **add** method.

4. The three operations above will add a group to the group list of a client. However, it is also important for the client to handle events and API callbacks to keep the UI components in sync with server updates.
    

   ```js
   function createGroupSuccess() {
   	// handle success response
   	console.log('create group success');
   }
   
   function createGroupFail(e) {
   	// handle failed response
   	console.log('create group fail');
   	console.log(e);
   }

   // handle the "group added" event, usually it is at this
   // point to update the group list on the UI after this
   // event is received.
   client.personsAndGroupsManager.all.groups.added(onGroupAdded);
   
  ```


## Rename a Group
<a name="sectionSection2"> </a>

With a  **client** object that is already signed in:


1. Get a group instance.

  ```js
  client.personsAndGroupsManager.all.groups.get().then(function() {
	var group = client.personsAndGroupsManager.all.groups()[0];
	
	…
});

  ```

2. Rename the group.
    

 ```js
  
 group.name("New name");

   ```


   Or rename the group in this way:
    


  ```js
  
 group.name.set("New name").then(renameGroupSuccess, renameGroupFail);

   ```

3. The difference between the two operations above is that the  **set** method returns a promise so that the client can easily handle the async response.
    

  ```js
  
  function renameGroupSuccess() {
  	console.log('renameGroup success');
  }
 
  function renameGroupFail(e) {
  	console.log('renameGroup fail');
  	console.log(e);
  }
 
   ```


 >**Note**  The client might observe different behaviors regarding renaming groups, depending on the Contact Store configurations on the server side.


## Delete a Group
<a name="sectionSection3"> </a>

A user-defined group can be deleted from the groups list (also deleted on the server), and a distribution group can be removed from the group list (not deleted on the server). These operations are achieved by using the same API.

With a  **client** object that is already signed in:


1. Get a group instance.
    

  ```js
 client.personsAndGroupsManager.all.groups.get().then(function() {
     var group = client.personsAndGroupsManager.all.groups()[0];

	…
});

  ```

2. Remove the group from the client's list of groups.
    

  ```js
 client.personsAndGroupsManager.all.groups.remove(group).then(
 	removeGroupSuccess, removeGroupFail
 );
 
  ```

3. As mentioned above, it is also important for the client to handle events and API callbacks to keep the UI components in sync with server updates.

 ```js
 function removeGroupSuccess() {
 	console.log('removeGroup success');
 }

 function removeGroupFail(e) {
 	console.log('removeGroup fail');
 	console.log(e);
 }
 
 // handle the "group removed" event, usually it is at this
 // point to update the group list on the UI after this
 // event is received.
 client.personsAndGroupsManager.all.groups.removed(onGroupRemoved);

  ```


## Add a Person to a Group
<a name="sectionSection4"> </a>

With an existing  **group** instance and a **person** instance:


1. Add person to the persons list of the group.
    

  ```js
  group.persons.add(person).then(addPersonSuccess, addPersonFail);
  
   ```

2. The client must handle events and API callbacks to keep the UI components in sync with server updates.
    

  ```js
  
 function addPersonSuccess() {
 	console.log('addPerson success');
 }
 
 function addPersonFail(e) {
 	console.log('removePerson fail');
 	console.log(e);
 }
 
 // handle the "contact added" event, usually it is at this
 // point to update the contact list on the UI after this
 // event is received.
 
 group.persons.added(onPersonAdded);
 
 ```


## Remove a Person from a Group
<a name="sectionSection5"> </a>

With an existing  **group** instance and a **person** instance:


1. Remove person from the person list of the group.
    

 ```js
  
 group.persons.remove(person).then(
 	removePersonSuccess, removePersonFail
 );

   ```

2. The client must handle events and API callbacks to keep the UI components in sync with server updates.
    

 ```js
   
 function removePersonSuccess() {
 	console.log('removePerson success');
 }
 
 function removePersonFail(e) {
 	console.log('removePerson fail');
 	console.log(e);
 }
 // handle the "contact removed" event, usually it is at this
 // point to update the contact list on the UI after this
 // event is received.
   group.persons.removed(onPersonRemoved);
 
   ```

