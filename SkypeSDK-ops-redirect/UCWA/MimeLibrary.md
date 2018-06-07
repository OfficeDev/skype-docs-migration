
# Mime library
Mime.js is a JavaScript library that helps parse MIME messages.


 _**Applies to:** Skype for Business 2015_

The Mime module can be used for processing messages with multipart content, and translating them into Message objects, like those used in the Transport module or JavaScript's XHR.


## Create a Mime object

The following example shows how a **Mime** object can be created.


```
var Mime = new microsoft.rtc.ucwa.samples.Mime();
```

The variable declared in the preceding example is used in the subsequent example in this topic.


## processMessage(data)

The **processMessage** function begins the processing of data into an array of Message objects.



|**Parameter**|**Description**|
|:-----|:-----|
|data|Data containing MIME messages.|
 **Returns**: An array of Message objects where each has the following form.




```
{
 status: 200,
 statusText: "success",
 responseText: "{data: "hello world"}",
 header: "Cache-Control: no-store",
 messageId: null
}
```

 **Syntax**




```
processMessage(data )
```

 **Example**

In the following example, data is set with some typical MIME content. Note that some content has been removed and the remainder has been formatted to make it easier to read.




```
var data = {
 headers: 'X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com\r\n
 Pragma: no-cache\r\n
 Date: Fri, 22 Feb 2013 07:35:38 GMT\r\n
 Server: Microsoft-IIS/7.5\r\n
 X-AspNet-Version: 4.0.30319\r\n
 X-Powered-By: ASP.NET\r\n
 Content-Type: multipart/batching; boundary="01cf4e5a-4b88-48cd-848b-aa56682ac369"\r\n
 Cache-Control: no-cache\r\n
 Connection: Keep-Alive\r\n
 Content-Length: 4069\r\n
 Expires: -1\r\n',
 messageId: '69330423-58cc-4900-bd32-aef2dc5e2962',
 readyState: 4,
 responseText: '--01cf4e5a-4b88-48cd-848b-aa56682ac369\r\n
 Content-Type: application/http; msgtype=response\r\n\r\nHTTP/1.1 200 OK\r\n
 Cache-Control: no-cache\r\n
 Content-Type: application/json; charset=utf-8\r\n\r\n﻿
 {
 "_links":{
 "self":{"href":"/ucwa/oauth/v1/applications/1036/people/contacts"}
 },
 "_embedded":{
 "contact": [{
 "uri":"sip:JohnDoe@contoso.com",
 "sourceNetwork":"SameEnterprise",
 "company":"Contoso",
 "emailAddresses": ["JohnDoe@contoso.com"],
 "workPhoneNumber":"tel:+19185550107",
 "type":"User",
 "name":"John Doe",
 "_links":{
 "self":{"href":"/ucwa/oauth/v1/applications/1036/people/JohnDoe@contoso.com"},
 "contactNote":{"href":"/ucwa/oauth/v1/applications/1036/people/JohnDoe@contoso.com/note"},
 "contactSupportedModalities":{
 "href":"/ucwa/oauth/v1/applications/1036/people/JohnDoe@contoso.com/supportedMedia"}
 },
 "rel":"contact",
 "etag":"58253032"
 },
 {
 "uri":"sip:janedoe@contoso.com",
 "sourceNetwork":"SameEnterprise",
 "emailAddresses": ["janedoe@contoso.com"],
 "type":"User",
 "name":"Jane Doe",
 "_links":{
 "self":{"href":"/ucwa/oauth/v1/applications/1036/people/janedoe@contoso.com"},
 "contactNote":{"href":"/ucwa/oauth/v1/applications/1036/people/janedoe@contoso.com/note"},
 "contactSupportedModalities":{
 "href":"/ucwa/oauth/v1/applications/1036/people/janedoe@contoso.com/supportedMedia"}
 },
 "rel":"contact",
 "etag":"225270755"
 }]
 },
 "rel":"myContacts"
 }\r\n
 --01cf4e5a-4b88-48cd-848b-aa56682ac369\r\n
 Content-Type: application/http; msgtype=response\r\n\r\n
 HTTP/1.1 200 OK\r\n
 Cache-Control: no-cache\r\n
 Content-Type: application/json; charset=utf-8\r\n\r\n
 {
 "name":"Jane Doe",
 "uri":"sip:janedoe@contoso.com",
 "_links":{
 "self":{"href":"/ucwa/oauth/v1/applications/1036/me"},
 "note":{"href":"/ucwa/oauth/v1/applications/1036/me/note"},
 "presence":{"href":"/ucwa/oauth/v1/applications/1036/me/presence"},
 "location":{"href":"/ucwa/oauth/v1/applications/1036/me/location"},
 "reportMyActivity":{"href":"/ucwa/oauth/v1/applications/1036/me/reportMyActivity"},
 "callForwardingSettings":{"href":"/ucwa/oauth/v1/applications/1036/me/callForwardingSettings"},
 "phones":{"href":"/ucwa/oauth/v1/applications/1036/me/phones"},
 "photo":{"href":"/ucwa/oauth/v1/applications/1036/photos/janedoe@contoso.com"}
 },
 "rel":"me"
 }\r\n
 --01cf4e5a-4b88-48cd-848b-aa56682ac369--\r\n',
 status: 200,
 statusText: 'OK'
};

```

In the following example, **processMessage** is used to process the data of the previous example.




```
results = Mime.processMessage(data);

if (results !== undefined) {
 for (var item in results) {
 // Start examining status, responseText, headers, etc here...
 }
}
```

