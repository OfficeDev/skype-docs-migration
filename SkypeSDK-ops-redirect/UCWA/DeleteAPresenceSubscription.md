
# Delete a presence subscription
Delete an active presence subscription.


 _**Applies to:** Skype for Business 2015_

Deleting an ongoing presence subscription involves accessing the active [presenceSubscription](presenceSubscription_ref.md) resource. This resource is created as the result of submitting a POST request to subscribe to the presence of specified contacts or a specified group. See [Subscribe to the presence of a group of contacts](SubscribeToThePresenceOfAGroupOfContacts.md) and [Subscribe to the presence of selected contacts](SubscribeToThePresenceOfSelectedContacts.md) for information on how to obtain the required URL to access the **presenceSubscription** resource. A link to this resource will also be sent as part of the **presenceSubscription** **updated** event notification when the subscription is about to expire.

The steps here assume that you have already created an application and have received a response that contains the href for an [application](application_ref.md) resource. For more information, see [Create an application](CreateAnApplication.md).

1. Send a DELETE request on **presenceSubscription**.
 
  To delete a presence subscription, send a DELETE request on the corresponding **presenceSubscription** resource. An example of this request is shown as follows, where 97b6bd66 is the presence subscription ID.

  ```
  DELETE https://lyncweb.contoso.com/ucwa/oauth/v1/applications/101/people/presenceSubscriptions/97b6bd66 HTTP/1.1
  Authorization: Bearer cwt=AAEBHAEFAAAAAAAFFQAAAIxVppb2z4Dxaju2054F...
  Accept: */*
  X-Requested-With: XMLHttpRequest
  Referer: https://lyncweb.contoso.com/Autodiscover/XFrame/XFrame.html
  Accept-Language: en-us
  Accept-Encoding: gzip, deflate
  User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.3; MS-RTC LM 8; Zune 4.7; BRI/2; .NET4.0C; .NET4.0E)
  Host: lyncweb.contoso.com
  Content-Length: 0
  DNT: 1
  Connection: Keep-Alive
  Cache-Control: no-cache
  ```

2. Process the response to the previous DELETE request.
 
 If successful, a 204 No Content response will be returned.
 
  ```
  HTTP/1.1 204 No Content
  Connection: Keep-Alive
  Date: Fri, 25 Jan 2013 18:42:35 GMT
  Server: Microsoft-IIS/7.5
  Cache-Control: no-cache
  X-AspNet-Version: 4.0.30319
  X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com
  X-Powered-By: ASP.NET

  ```
  A presence subscription **deleted** event will be sent on the event channel. An example is shown as follows:
 
  ```
  {
  "_links":{
  "self":{"href":"/ucwa/oauth/v1/applications/101/events?ack=10"},
  "next":{"href":"/ucwa/oauth/v1/applications/101/events?ck=11"}},
  "sender": [
  {
  "rel":"people","href":"/ucwa/oauth/v1/applications/101/people",
  "events": [
  {
  "link":{
  "rel":"contact",
  "href":"/ucwa/oauth/v1/applications/101/people/contactcenter@contoso.com"},
  "in":{
  "rel":"subscribedContacts",
  "href":"/ucwa/oauth/v1/applications/101/people/subscribedContacts"},
  "type":"deleted"},
  {
  "link":{
  "rel":"presenceSubscription",
  "href":"/ucwa/oauth/v1/applications/101/people/presenceSubscriptions/97b6bd66"},
  "type":"deleted"}
  ]
  }
  ]
  }
  ```


 Note that the associated subscribed contacts are also deleted.
 
