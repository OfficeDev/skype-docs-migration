
# Authentication library
Authentication.js is a JavaScript library that helps authenticate the user.


 _**Applies to:** Skype for Business 2015_

The Authentication module is responsible for responding to a challenge for credentials during auto-discovery.
This module provides several functions that a Microsoft Unified Communications Web API 2.0 application can use to authenticate the user on whose behalf the application is running.

## Create an Authentication object
<a name="sectionSection0"> </a>

The **Authentication** constructor has two parameters: a **Cache** object and a **Transport** object. For more information, see [Cache library](CacheLibrary.md) and [Transport library](TransportLibrary.md). Before an **Authentication** object can be created, objects representing the two parameters must be created.


```
var targetOrigin = https://www.contoso.com,
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin);

var Authentication = new microsoft.rtc.ucwa.samples.Authentication(Cache, Transport);
```

The variables declared in the preceding example are used in subsequent examples in this topic.


## destroyApplication(callback)
<a name="sectionSection1"> </a>

The **destroyApplication** function attempts to destroy the currently active UCWA application.



|**Parameter**|**Description**|
|:-----|:-----|
|callback|Callback to execute after destroying the application.|
 **Syntax**




```
destroyApplication(callback)
```

 **Example**




```
Authentication.destroyApplication(handleStatus);

function handleStatus(isAuthenticated, data) {
 if (data &amp;&amp; data.statusText &amp;&amp; data.statusText === "success") {
 // Application is now online...
 } else {
 // Application is now offline or successfully destroyed...
 }
}
```


### Remarks

If the user is not currently authenticated, it will attempt to call back indicating authentication status with no data. Otherwise, it will attempt to delete the application resource followed by using the callback to indicate authentication status.

The callback should have the following method signature:




```
function callback( /* bool */ authenticatedState, /* obj */ responseData )
```


## isAuthenticated()
<a name="sectionSection2"> </a>

The **isAuthenticated** function determines whether application creation and user authentication have succeeded.

 **Returns**: Boolean indicating whether the user is authenticated.

 **Syntax**




```
isAuthenticated()
```

 **Example**




```
if (Authentication.isAuthenticated()) {
 alert("Application is online");
}
```


## setAnonymousJoinUri(conferenceUri)
<a name="sectionSection3"> </a>

The **setAnonymousJoinUri** function sets an internal variable with the conference URI and performs a check to determine whether the conference URI is valid. Using a conference URI a user can join a conference anonymously.



|**Parameter**|**Description**|
|:-----|:-----|
|conferenceUri|The URI of the conference to join.|
 **Returns**: Boolean indicating whether the conference URI was valid and was stored.

 **Syntax**




```
setAnonymousJoinUri(conferenceUri)
```

 **Example**




```
var result = Authentication.setAnonymousJoinUri(conferenceUri);
```


### Remarks

A conference URI should have the following form: `sip:john@contoso.com;gruu;opaque=app:conf:focus:id:G03W98W4`


## setCredentials(username, password)
<a name="sectionSection4"> </a>

The **setCredentials** function sets the user credentials to be used by authentication.



|**Parameter**|**Description**|
|:-----|:-----|
|username|The user name to be used for authentication.|
|password|The password to be used for authentication.|
 **Syntax**




```
setCredentials(username, password)
```

 **Example**




```
Authentication.setCredentials("bob@contoso.com", "A.B.#.123!");
```


## start(link, application, callback)
<a name="sectionSection5"> </a>

The **start** function starts the authentication process.



|**Parameter**|**Description**|
|:-----|:-----|
|link|The URL of the site where authentication is taking place, which is the AutodiscoverService root location for the user's domain, such as `https://lyncweb.contoso.com/Autodiscover/AutodiscoverService.svc/root/oauth/user?originalDomain=contoso.com`.|
|application|The request payload for the application to be created.An example application is shown after this table |
|callback|Callback to execute after authentication completes.|
 **Syntax**




```
start(link, application, callback)
```

 **Example**




```
var Application = {
 userAgent: "UCWA Samples",
 endpointId: this.GeneralHelper.generateUUID(),
 culture: "en-US"
};
Authentication.start(link, Application, handleResult);
```

After the **start** function is called, it stores the application and callback and begins handling state logic.

