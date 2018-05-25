
# Application dashboard
The **application** resource serves as a kind of dashboard that represents a single application of the user.


 _**Applies to:** Skype for Business 2015_


An [application](application_ref.md) resource represents a single application on one of a user's devices or browsers. Based on the inputs provided during application creation, a unique **application** resource is created by the Microsoft Unified Communications Web API 2.0 to represent the user in the context of an application.

## Resource representation
<a name="sectionSection0"> </a>

The following table contains a representation of the **application** resource.


**Property bag**
```
"rel" : "application",
"culture" : "en-us",
"userAgent" : "ContosoApp/1.0"
```

**Links**
```
"self" : { 
 "href" : "/ucwa/v1/applications/105" 
},
"batch" : {
 "href" : "/ucwa/v1/applications/105/batch"
},
"events" : {
 "href" : "/ucwa/v1/applications/105/events"
},
"policies" : {
 "href" : "/ucwa/v1/applications/105/policies"
}
```

**Embedded resources**
```
"communication" : { ... },
"me" : { ... },
"onlineMeetings" : { ... },
"people" : { ... }

```


The **application** resource can be thought of as a dashboard that shows the communication and collaboration capabilities available to a specific application on a specific server. The embedded resources within an application, shown in the following table, provide a view of these capabilities. The **application** resource also contains links for performing operations in a batch, receiving asynchronous events, and fetching server policies.



|**Embedded resources**|**Description**|
|:-----|:-----|
| [me](me_ref.md)|Represents the user. The **me** resource is updated whenever the application becomes ready for incoming calls and leaves lurker mode.|
| [people](people_ref.md)|A hub for the people with whom the logged-on user can communicate, using Skype for Business. The **people** resource provides access to resources that enable the logged-on user to find, organize, communicate with, and subscribe to the presence of other people.|
| [onlineMeetings](onlineMeetings_ref.md)|Represents the dashboard for viewing and scheduling online meetings. The **onlineMeetings** resource exposes the meetings and settings available to the user, including the ability to create a new [myOnlineMeeting](myOnlineMeeting_ref.md).|
| [communication](communication_ref.md)|Represents the dashboard for communication capabilities. The **communication** resource exposes the modalities and settings available to the user, including the ability to join an [onlineMeeting](onlineMeeting_ref.md) or create an ad-hoc **onlineMeeting**.|

## Creating an application
<a name="sectionSection1"> </a>

An application is created by performing a POST on the [applications](applications_ref.md) resource. As a result of this operation the **application** resource is returned. The application can be fetched at any time by doing a GET on the **application** resource. When the user exits the application, the client must delete the application by sending a DELETE request on the **application** resource.


## Application lifetime
<a name="sectionSection2"> </a>

It is possible for a server to delete an application without a client sending a DELETE request on the application resource. This might happen for various reasons, and subsequent requests will fail with the relevant error codes. A client application should be prepared to handle the following errors, which may occur during any operation.



|**HTTP status code**|**UCWA error subcode**|**Description**|
|:-----|:-----|:-----|
|404 NotFound|ApplicationNotFound|This implies that the application does not exist on the server any more.|
|410 Gone|TooManyApplications|The total number of all applications created by the user exceeded the limit.|
|410 Gone|InactiveApplicationExpired|Either the application did not park a pending get for too long; or the application did not report user activity for too long (this only applies if "MakeMeAvailable" was previously invoked).|
|410 Gone|UserAgentNotAllowed|The UserAgent for the application is no longer supported.|
If a 404 ApplicationNotFound response is received unexpectedly, the client may possibly recreate the application and resume operations without user intervention. If 410 Gone is received it is best to display an error message to the user including the UCWA 2.0 error subcode, and then wait for the user to explicitly restart the client.

