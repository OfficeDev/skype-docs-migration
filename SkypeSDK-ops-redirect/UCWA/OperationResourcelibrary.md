
# OperationResource library
OperationResource.js is a JavaScript library that helps start operations whose outcomes appear in the event channel.


 _**Applies to:** Skype for Business 2015_

 
The OperationResource module simplifies the process of starting an operation resource in the event channel. Use the functions in this module to track event channel data based on href, resource, or everything.
Some UCWA resources, such as [addMessaging](addMessaging_ref.md), [startMessaging](startMessaging_ref.md), [addPhoneAudio](addPhoneAudio_ref.md), [startPhoneAudio](startPhoneAudio_ref.md), [addParticipant](addParticipant_ref.md), [joinOnlineMeeting](joinOnlineMeeting_ref.md), and [startOnlineMeeting](startOnlineMeeting_ref.md), cause the server to create an operation resource that usually takes the form of an invitation. For more information, see [Operation resource](OperationResource.md). For example, the **addMessaging** and **startMessaging** resources cause the server to create a [messagingInvitation](messagingInvitation_ref.md) resource, and the **addParticipant** resource causes a [participantInvitation](participantInvitation_ref.md) resource to be sent.
After the server creates the invitation, it sends it on the event channel. If a UCWA application has created a handler for this type of event, the application can process the invitation.
The functions in the OperationResource module simplify the actions that are needed to start an operation resource in the event channel. 

## Create an OperationResource object
<a name="sectionSection0"> </a>

An **OperationResource** object carries out the following steps (order matters!).


1. Create an operation ID.
 
2. Register handlers with the Event module for the operation ID in step 1.
 
3. Issue an HTTP request via the Transport module using the operation ID from step 1.
 
The OperationResource module is a thin wrapper around the Transport and Events modules. As a result, when an **OperationResource** object is created, **Transport** and **Events** objects must also be created. For more information, see [Transport library](TransportLibrary.md) and [Events library](EventsLibrary.md).




```
var domain = "https://www.example.com",
element = $("#frame") [0].contentWindow,
targetOrigin = "https://www.myDomain.com",
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),
Events = new microsoft.rtc.ucwa.samples.Event(Cache, Transport),
opRes = new microsoft.rtc.ucwa.samples.OperationResource(Transport, Events);
```

The variables declared in the preceding examples are used in subsequent examples in this topic.


## startOperation(data, callbacks)
<a name="sectionSection1"> </a>

Begins processing of an operation.



|**Parameter**|**Description**|
|:-----|:-----|
|data|Request object to process.|
|handlers|The set of handlers, one for each event type.|
 **Returns**: A number representing the operation ID.

 **Syntax**




```
startOperation(request , handlers )
```

 **Example**

In this sample, _startMessagingHref_is set with the relative URL of the **startMessaging** resource. Next, a _request_object is created, with properties that specify the URL, HTTP request type, and data. The handlers object is an array of functions that will be called when the event type is "started" or "completed". Finally, the call to the **startOperation** function begins the process of creating a **messagingInvitation** in the event channel.




```
Transport.setElement(element, domain);

var startMessagingHref = "/ucwa/oauth/v1/applications/103645603125/communication/messagingInvitations",
request = {
 url: startMessagingHref,
 type: "post",
 data: imData
},
handlers = {
 started: function(data) {
 alert("started!");
 },
 completed: function(data) {
 alert("completed!");
 }
},
operationId = opRes.startOperation(request, handlers);

```


### Remarks

The **startOperation** function does the following:


1. Generates an operation ID.
 
2. Registers the provided event handlers using the operation ID from step 1 as the trigger.
 
3. Starts the event channel.
 
4. Adds the operation ID to the request object.
 
5. Calls the Transport library to issue the request.
 
A _request_parameter should be an object in the form of:




```
{
 url: "myLink" (HTTP request URL),
 type: "get" (get, post, put, delete),
 acceptType: "application/json" (default, optional),
 contentType: "application/json" (default, optional),
 data: "hello world" (any kind of JSON data),
 callback: (optional)
}
```

The _handlers_parameter should an object in the form of:




```
{
 started: function(data) {...},
 updated: function(data) {...},
 completed: function(data) {...}
}
```


## stopOperation(id)
<a name="sectionSection2"> </a>

Stops a UCWA operation resource and removes handlers for changes from the event channel.



|**Parameter**|**Description**|
|:-----|:-----|
|id|The identifier of the UCWA operation.|
 **Syntax**




```
stopOperation(id )
```

 **Example**




```
opRes.stopOperation(operationId);

```

