
# Listening for and generating presence events


 _**Applies to:** Skype for Business 2015_

 **In this article**<br/>
[Getting user presence information](#sectionSection0)<br/>
[Presence subscription ](#sectionSection1)<br/>
[Generating presence change events](#sectionSection2)<br/>
[Listening for presence changes](#sectionSection3)<br/>
[Canceling a presence subscription](#sectionSection4)


Skype Developer Platform for Web users get current presence for a Skype for Business user by listening for person presence events on the SDK client. In this topic you learn how to listen for other user's presence changes and how to post user presence changes to Skype for Business Server . 

## Getting user presence information
<a name="sectionSection0"> </a>

Before your code starts getting presence event notifications, it must get a [Person]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.person.html) object and "subscribe" to presence changes on the person. There are two ways to get a **Person** object:


- Read the [PersonAndGroupsManager.all]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.personsandgroupsmanager.html#all) property and iterate the[Group.persons]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.group.html#persons) property to find the **Person** object you want presence for.
    
- Create a search query on the [PersonAndGroupsManager]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.personsandgroupsmanager.html) by calling the **createPersonSearchQuery** method. A[SearchQuery]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.searchquery.html) object is returned.
    
The following sample code is the  **onSuccess** argument of the[Promise]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.promise.html) returned by the[SearchQuery.getMore]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.searchquery.html#getmore) operation. It shows how to use JavaScript and the Skype Web SDK to get several presence elements for persons in the search results. The text of these presence values are appended to an HTML tag with the id "results".




```js

       pSearch.getMore().then(function () {
            const sr = pSearch.results();
            $('#status').text('Search succeeded. Parsing results...');

            // and throw an exception if no contacts found:
            // the exception will be passed to the next "fail"
            // handler: this is how Promises/A+ work.
            if (sr.length == 0)
                throw new Error('The contact not found');

            // then take any found contact
            // and pass the found contact down the chain
            return sr[0].result;

        }).then(function (contact) {
            $('#status').text('A contact found. Creating a view for it...');
     
            var cDisplayName = $('<p>').addClass("primary");
            var cTitle = $('<p>').addClass("secondary");
  
          contact.displayName.get().then(function (displayName) {
                cDisplayName.text(displayName);
            });

            contact.title.get().then(function (title) {
                cTitle.text(title);
            });
  
   
            $('#status').text('A contact was found and displayed.');
        })
```


## Presence subscription
<a name="sectionSection1"> </a>

A presence subscription on a person is a request on the Skype for Business Server to provide continual updates to a user's presence. A presence update generates an event on the associated  **person** object whenever a user changes a presence value such as status or the personal note. You should create a unique presence subscription for each person that you display in your UI.

You can cancel a presence subscription for a given person at any time. Normally presence subscriptions are cancelled when a subscribed person is no longer shown on your UI. Cancelling unneeded presence subscriptions can lead to better application performance.

>**Note**: A presence fetch is also possible using the **get** method on the persons's **status** property. This is a more lightweight operation than creating a subscription, but it will
retrieve the person's latest presence at that particular point in time only (no persistent notifications).  


## Generating presence change events
<a name="sectionSection2"> </a>

By changing your status, activity, or notes, you generate presence change events. The following example changes the signed in user's presence note and sends the change to Skype for Business Server. Anyone who has subscribed to changes to this user's presence note is sent a presence changed event.


```js
$('#self-note').on('change', function (event) {
    // tell the client to change the note
    client.personsAndGroupsManager.mePerson.note.text.set($('#self-note').val()).then(function () {
        alert('The  note has been changed');
    }).then(null, function (error) {
        // and if could not be changed, report the failure
        alert(error || 'The server has rejected this note change.');
    });
});
```


## Listening for presence changes
<a name="sectionSection3"> </a>

When a person signs in, signs out or changes their activity, the server sends notification to any client that is subscribed to presence notifications for the person. These presence notifications happen frequently and your app should respond by updating the UI to reflect person presence changes. Subscribe to person presence events by calling the  **Property.changed** method on the **MePerson.status** property or **MePerson.activity**.

The following sample code shows how to get notification of changes to a person's presence.




```js

//cache the first contact in the collection in a variable
var person = application.personsAndGroupsManager.persons(0); 
   
person.status.changed(onStatus);   //add a listener for changes to this contact's availability
person.activity.changed(onActivity);

function onStatus(status) {
    alert('The presence of = ' + person.displayName() + ' is now: ' + status);
}

function onActivity(activity) {
    alert('The activity of = ' + person.displayName() + ' is now: ' + activity);
}

Var subStatus = person.status.subscribe(); // start the subscription
Var subActivity = person.activity.subscribe(); // start the subscription


```


## Canceling a presence subscription
<a name="sectionSection4"> </a>

A subscription uses resources and generates both GET and POST requests. To avoid using resources and bandwidth unnecessarily, be sure to end a presence subscription before your application moves a person object out of scope. JavaScript does not have a concept of a finalizer or destructor, so the person object itself cannot determine when it is no longer needed. To end a subscription, call the  **dispose** function on each object returned by the[Property.subscribe]( http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.property.html#subscribe) method called for each subscription.

The following sample cancels a presence subscription by iterating an array of subscription objects and disposing of each in turn.




```js
// let the user disable presence subscription
$('#unsubscribe').click(function () {
    // tell the contact that we are no longer interested in
    // its presence and note properties
    $.each(subP, function (i, sub) {
        sub.dispose();
    });
    subP = [];
    $.each(subM, function (i, sub) {
        sub.dispose();
    });
    subM = [];
});
```


## See also
<a name="sectionSection4"> </a>


#### Concepts


[Get a person and listen for availability]( /ListenForAvailability.md)
