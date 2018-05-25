# events

 _**Applies to:** Skype for Business 2015_


Represents the event channel resource.
            

## Web Link
<a name = "sectionSection0"> </a>

For more on web links, see [Web links](WebLinks.md).


|**Name**|**Description**|
|:-----|:-----|
|rel|The resource that this link points to. In JSON, this is the outer container.|
|href|The location of this resource on the server, and the target of an HTTP operation.|

## Resource description
<a name = "sectionSection1"> </a>

Each event in the event channel will have a link to the resource that produced the event. Optionally, the resource itself could also be embedded in the event channel.However, the application should handle events with or without embedded resource. If the resource is not embedded, the application can fetch the resource if needed.

### Properties



None

### Links



This resource can have the following relationships.

|**Link**|**Description**|
|:-----|:-----|
|self|The link to the current resource.|

## Operations



<a name="sectionSection2"></a>

### GET




Get events through channel.

#### Query parameters




|**Name**|**Description**|**Required?**|
|:-----|:-----|:-----|
|low|The timer value for releasing an event channel request for low urgency items.The event channel is released when low urgency events have accumulated for the length of time specified by this value.The default value is 15 seconds. The minimum possible value is 5 seconds and the maximum possible value is 1800 seconds.|No|
|medium|The timer value for releasing an event channel request for medium urgency items.The event channel is released when medium urgency events have accumulated for the length of time specified by this value.The default value is 5 seconds. The minimum possible value is 5 seconds and the maximum possible value is 1800 seconds.|No|
|priority|The priority of this event channel request relative to other requests with the same ack ID.If a client sends multiple requests with different aggregation settings right after each other, they might arrive at the server in an orderwhich is different from what the client intended. The Priority parameter helps the server figure out the intended order. Requests with higher(larger) priority value will replace requests with lower priority, but not the other way around. Requests with the same priority are processedin the order of arrival. The default priority is 0.|No|
|timeout|The event channel release timeout value when there are no events.The event channel is released after the specified time, even when no events have accumulated.The default value is 180 seconds. The minimum possible value is 180 seconds and the maximum possible value is 1800 seconds.|No|


#### Request body



None


#### Response body



The response from a GET request contains the properties and links shown in the Properties and Links sections at the top of this page.

#### Synchronous errors



The errors below (if any) are specific to this resource. Generic errors that can apply to any resource are covered in [Generic synchronous errors](GenericSynchronousErrors.md).

|**Error**|**Code**|**Subcode**|**Description**|
|:-----|:-----|:-----|:-----|
|ServiceFailure|500|InvalidExchangeServerVersion|Invalid exchange server version.The exchange mailbox of the server might have moved to an unsupported version for the required feature.|
|Conflict|409|AlreadyExists|The already exists error.|
|Conflict|409|TooManyGroups|The too many groups error.|
|Conflict|409|None|Un-supported Service/Resource/API error.|
|Gone|410|CannotRedirect|Cannot redirect since there is no back up pool configured.|

#### Examples



Only server-supplied query parameters, if any, are shown in the request sample.

#### JSON Request




```
Get http://sample:80/ucwa/v1/applications/appId/events?ack=1 HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com

```


#### JSON Response



This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.
```
HTTP/1.1 200 OK

```


#### XML Request




```
Get http://sample:80/ucwa/v1/applications/appId/events?ack=1 HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com

```


#### XML Response



This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.
```
HTTP/1.1 200 OK

```


