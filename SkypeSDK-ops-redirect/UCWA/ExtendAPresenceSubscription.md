
# Extend a presence subscription
Extend a presence subscription beyond its normal expiration time.


 _**Applies to:** Skype for Business 2015_

A presence subscription has an expiration time set by the **duration** parameter when the subscription is created. When the subscription is about to expire, a **presenceSubscription** **updated** event is sent on the event channel. Upon receiving such an event, the application can choose to extend, ignore, or delete the subscription. When ignored, the subscription will expire when its lifetime reaches the preset **duration** value. To delete a presence subscription, see [Delete a presence subscription](DeleteAPresenceSubscription.md). 

To extend the subscription, follow these steps:
The steps here assume that you have already created an application and have received a response that contains the href for an [application](application_ref.md) resource. For more information, see [Create an application](CreateAnApplication.md).

1. Parse the **presenceSubscription** **updated** event.
 
  Parse the **self** link of the **presenceSubscription** **updated** event (as shown below) to obtain the URL of the resource representing the presence subscription.
 
  ```
  {
  "_links":{
  "self":{"href":"/ucwa/v1/applications/101/events?ack=10"},
  "next":{"href":"/ucwa/v1/applications/101/events?ack=11"}
  },
  "sender": [
  {
  "rel":"people",
  "href":"/ucwa/v1/applications/101/people",
  "events": [
  {
  "link":{
  "rel":"presenceSubscription",
  "href":"/ucwa/v1/applications/101/people/presenceSubscriptions/97b6bd66"
  },
  "_embedded":{
  "presenceSubscription":{
  "id":"97b6bd66",
  "_links":{
  "self":{"href":"/ucwa/v1/applications/101/people/presenceSubscriptions/97b6bd66"},
  "memberships":{"href":"/ucwa/v1/applications/101/people/presenceSubscriptionMemberships?presenceSubscriptionId=97b6bd66"},
  "addToPresenceSubscription":{"href":"/ucwa/v1/applications/101/people/presenceSubscriptionMemberships?presenceSubscriptionId=97b6bd66"}
  },
  "rel":"presenceSubscription"
  }
  },
  "type":"updated"
  }
  ]
  }]
  }

  ```

2. Send a POST request on the **presenceSubscription** resource with a new **duration** value.
 
  Specify the new **duration** value in the query parameter. An example of the HTTP request is shown as follows:
 
  ```
  POST https://lyncweb.contoso.com/ucwa/oauth/v1/applications/101/people/presenceSubscriptions/97b6bd66?duration=11 HTTP/1.1 
  Authorization: Bearer cwt=AAEBHAEFAAAAAAAFFQAAAIxVppb
  Accept: application/json
  X-Ms-Origin: http://localhost
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

3. Process the response from the POST request above.
 
  If the request is successful, a 200 OK response will be returned. An example is shown as follows:
 
  ```
  HTTP/1.1 200 OK
  Connection: Keep-Alive
  Content-Length: 541
  Date: Fri, 25 Jan 2013 19:38:41 GMT
  Content-Type: application/json; charset=utf-8
  Server: Microsoft-IIS/7.5
  Cache-Control: no-cache
  X-AspNet-Version: 4.0.30319
  X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com
  X-Powered-By: ASP.NET

  {
   "id":"97b6bd66",
   "_links":{
   "self":{"href":"/ucwa/oauth/v1/applications/101/people/presenceSubscriptions/97b6bd66"},
   "memberships":{"href":"/ucwa/oauth/v1/applications/101/people/presenceSubscriptionMemberships?presenceSubscriptionId=97b6bd66"},
   "addToPresenceSubscription":{"href":"/ucwa/oauth/v1/applications/101/people/presenceSubscriptionMemberships?presenceSubscriptionId=97b6bd66"}
   },
   "rel":"presenceSubscription"
  }

  ```


  If the presence subscription has expired when the extension request is submitted, a 404 Not Found response will be returned.
 
  ```
  HTTP/1.1 404 Not Found
  Connection: Keep-Alive
  Content-Length: 148
  Expires: -1
  Date: Fri, 25 Jan 2013 23:43:00 GMT
  Content-Type: application/json
  Server: Microsoft-IIS/7.5
  Cache-Control: no-cache
  Pragma: no-cache
  X-AspNet-Version: 4.0.30319
  X-MS-Server-Fqdn: W15-LYNC-SE1.metio.ms
  X-Powered-By: ASP.NET

  {
   "code":"NotFound",
   "subcode":"ApplicationNotFound",
   "message":"An error occurred. Please retry. If the problem persists, contact your support team."
  }

  ```


  In this case, the application should recreate the subscription. See [Subscribe to the presence of a group of contacts](SubscribeToThePresenceOfAGroupOfContacts.md) or [Subscribe to the presence of selected contacts](SubscribeToThePresenceOfSelectedContacts.md) for information on how to create the presenceSubscription resource, depending on how the original request was created.
 
