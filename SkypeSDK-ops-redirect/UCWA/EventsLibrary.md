
# Events library
Events.js is a JavaScript library that helps start and stop the event channel and add event handlers.


 _**Applies to:** Skype for Business 2015_

The Events module provides access to the UCWA event channel, enabling application developers to start or stop the event channel, and to add or remove handlers for events of interest to them.
Some UCWA resources, such as the [participantInvitation](participantInvitation_ref.md), [messagingInvitation](messagingInvitation_ref.md), and [onlineMeetingInvitation](onlineMeetingInvitation_ref.md) resources are called operation resources. These resources are created on the server as a result of a previous POST request on, respectively, the [addParticipant](addParticipant_ref.md) resource, the [addMessaging](addMessaging_ref.md) or [startMessaging](startMessaging_ref.md) resource, or the [joinOnlineMeeting](joinOnlineMeeting_ref.md) or [startOnlineMeeting](startOnlineMeeting_ref.md) resource. After the server creates the operation resource, the server sends it to the client on the event channel. For more information, see [Operation resource](OperationResource.md).

## Create an Events object
<a name="sectionSection0"> </a>

The **Events** constructor has two parameters: a **Cache** object and a **Transport** object. For more information, see [Cache library](CacheLibrary.md) and [Transport library](TransportLibrary.md). Before an **Events** object can be created, objects representing the two parameters must be created.


```
var domain = "https://www.example.com",
element = $("#frame") [0].contentWindow,
targetOrigin = "https://www.myDomain.com",
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin);

var Events = new microsoft.rtc.ucwa.samples.Events(Cache, Transport);
```

The variables declared in the preceding example are used in subsequent examples in this topic.


## addEventHandlers(raiser, handlers)
<a name="sectionSection1"> </a>

The **addEventHandlers** function adds an event handler for a specified resource.



|**Parameter**|**Description**|
|:-----|:-----|
|raiser|The resource that raises the event that will trigger the handlers.|
|handlers|The set of handlers, one for each event type.|
 **Syntax**




```
addEventHandlers(raiser , handlers )

```

 **Example**

In the following example _raiser_is an object whose _href_property indicates the resource we are interested in. In this example, the resource of interest is the **me** user's **presence** resource.

The _handlers_object is a collection of key-value pairs where each key indicates an event "type" and each paired value contains the name of a function that will be called to handle an event with that type. In this example, if the presence event "type" is either "started" or "updated", the _handlePresence_function is called.




```
var raiser = {
 href: '/me/presence'
},
handlers = {
 started: handlePresence,
 updated: handlePresence
};
 
function handlePresence(data) {
 if (data.results !== undefined) {
 alert(data.results);
 }
}
```

The next example passes the objects that are created in the previous example as parameters in the **addEventHandlers** function. This action creates handlers for the "started" and "update" event types on the event raiser, the **me** user's **presence** resource.




```
Events.addEventHandlers(raiser, handlers);

```


### Remarks

The _raiser_parameter should be an object containing _one_of the following:


```
{
 href: "myLink", // Relative URL of the resource provided by the server
 rel: "people", // Relation type
 operationId: "1918-bf83" // Unique, client-supplied ID for tracking operation resources on the event channel)
}
```

The _handlers_parameter should be an object containing _one or more_of the following:




```
{
 started : function(data) {...},
 updated : function(data) {...},
 completed : function(data) {...},
}
```


## removeEventHandlers(raiser)
<a name="sectionSection2"> </a>

The **removeEventHandlers** function removes event handlers for a specified resource.



|**Parameter**|**Description**|
|:-----|:-----|
|raiser|The raiser of the event whose handlers are to be removed.|
 **Syntax**




```
removeEventHandlers(raiser)
```

 **Example**

The following example removes any handlers for events raised by the [message](message_ref.md) resource.




```
Events.removeEventHandlers("message");
```


### Remarks

If a raiser for the event is not found, a message will be displayed in the console.


## startEvents()
<a name="sectionSection3"> </a>

The **startEvents** function begins listening on the event channel.

 **Syntax**




```
startEvents()
```

 **Example**




```
Events.startEvents();
```


### Remarks

Checks whether event handling is already active; if not, it makes the initial request to start receiving data on the event channel.


## stopEvents()
<a name="sectionSection4"> </a>

The **stopEvents** function stops listening on the event channel and clears the event handler array.

 **Syntax**




```
stopEvents()
```

 **Example**




```
Events.stopEvents();
```

