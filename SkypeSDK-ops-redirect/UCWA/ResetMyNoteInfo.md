
# Reset my note information
Reset the **me** user's note information.


 _**Applies to:** Skype for Business 2015_

Resetting a **me** user's note involves resource navigation from [application](application_ref.md) to [me](me_ref.md) to [note](note_ref.md). 

The steps here assume that you have already created an application and have received a response that contains the href for an [application](application_ref.md) resource. For more information, see [Create an application](CreateAnApplication.md).

1. Send a POST request on the makeMeAvailable resource. 
 
 One of the hypermedia links that are served in the response for the [application](application_ref.md) resource is the HREF for the [makeMeAvailable](makeMeAvailable_ref.md) resource, which can be found in the embedded [me](me_ref.md) resource.
 
    ```
    POST https://lyncweb.contoso.com/ucwa/oauth/v1/applications/101/me/makeMeAvailable HTTP/1.1
    Accept: application/json
    Content-Type: application/json
    Authorization: Bearer cwt=AAEB...buHc
    X-Ms-Origin: http://localhost
    X-Requested-With: XMLHttpRequest
    Referer: https://lyncweb.contoso.com/Autodiscover/XFrame/XFrame.html
    Accept-Language: en-us
    Accept-Encoding: gzip, deflate
    User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)
    Host: lyncweb.contoso.com
    Content-Length: 37
    Connection: Keep-Alive
    Cache-Control: no-cache

    {"SupportedModalities": ["Messaging"]}
    ```

2. Process the response from the request in the previous step.
 
 The response you receive should be 204 No content, as shown here. 
 
    ```
    HTTP/1.1 204 No Content
    Connection: Keep-Alive
    Date: Thu, 17 Jan 2013 00:00:00 GMT
    Server: Microsoft-IIS/7.5
    Cache-Control: no-cache
    X-AspNet-Version: 4.0.30319
    X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com
    X-Powered-By: ASP.NET
    ```

3. Send a GET request on the **application** resource.
 
 A sample request is shown here.
 
    ```
    GET https://lyncweb.contoso.com/ucwa/oauth/v1/applications/101 HTTP/1.1
    Authorization: Bearer cwt=AAEB...buHc
    Accept: application/json
    X-Ms-Origin: http://localhost
    X-Requested-With: XMLHttpRequest
    Referer: https://lyncweb.contoso.com/Autodiscover/XFrame/XFrame.html
    Accept-Language: en-us
    Accept-Encoding: gzip, deflate
    User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)
    Host: lyncweb.contoso.com
    Connection: Keep-Alive

    ```

4. Process the response from the previous request.
 
 You should receive a response code of 200 OK. The following is a typical response to the previous GET request.
 
 Some links in the response will be used in subsequent steps, so it is important to cache portions of the response body. The link that will be used later is that for the **note** resource.
 
 For brevity, some parts of the response body are omitted, and IDs and tokens are shortened.
 
    ```
    HTTP/1.1 200 OK
    Connection: Keep-Alive
    Content-Length: 1621
    Date: Wed, 13 Feb 2013 21:56:33 GMT
    Content-Type: application/json
    Server: Microsoft-IIS/7.5
    Cache-Control: no-cache
    X-AspNet-Version: 4.0.30319
    X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com
    X-Powered-By: ASP.NET

    {
    "culture":"en-US",
    "userAgent":"UCWA Samples",
    "_links":{
    "self":{"href":"/ucwa/oauth/v1/applications/101"},
    "policies":{"href":"/ucwa/oauth/v1/applications/101/policies"},
    "batch":{"href":"/ucwa/oauth/v1/applications/101/batch"},
    "events":{"href":"/ucwa/oauth/v1/applications/101/events?ack=1"}
    },
    "_embedded":{
    "me":{
    "name":"Dana Birkby",
    "uri":"sip:Dana@contoso.com",
    "emailAddresses": ["Dana@contoso.com"],
    "_links":{
    "self":{"href":"/ucwa/oauth/v1/applications/101/me"},
    "note":{"href":"/ucwa/oauth/v1/applications/101/me/note" },
    "presence":{"href":"/ucwa/oauth/v1/applications/101/me/presence"},
    "location":{"href":"/ucwa/oauth/v1/applications/101/me/location"},
    "reportMyActivity":{"href":"/ucwa/oauth/v1/applications/101/me/reportMyActivity"},
    "callForwardingSettings":{"href":"/ucwa/oauth/v1/applications/101/me/callForwardingSettings"},
    "phones":{"href":"/ucwa/oauth/v1/applications/101/me/phones"},
    "photo":{"href":"/ucwa/oauth/v1/applications/101/photos/Dana@contoso.com"}
    },
    "rel":"me"
    },
    "people":{...},
    "onlineMeetings":{...},
    "rel":"communication","etag":"29...41"}
    },
    "rel":"application"
    }
    ```

5. Send a POST request on the **note** resource.
 
 A sample request is shown here. Because the note is being reset (or cleared), no **message** property is sent with the request.
 
    ```
    POST /ucwa/oauth/v1/applications/101808602891/me/note HTTP/1.1
    Authorization: Bearer cwt=AAEB...buHc
    Accept: application/json
    X-Ms-Origin: http://localhost
    X-Requested-With: XMLHttpRequest
    Referer: https://lyncweb.contoso.com/Autodiscover/XFrame/XFrame.html
    Accept-Language: en-US
    Accept-Encoding: gzip, deflate
    User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3)
    Host: lyncweb.contoso.com
    Content-Length: 0
    DNT: 1
    Connection: Keep-Alive
    Cache-Control: no-cache
    ```

6. Process the response from the previous POST request.
 
 The response you receive should be 204 No content. This means that your note request has been received by the server. An event will confirm that this note is now being shared with other contacts.
 
    ```
    HTTP/1.1 204 No Content
    Connection: Keep-Alive
    Date: Thu, 17 Jan 2013 00:00:00 GMT
    Server: Microsoft-IIS/7.5
    Cache-Control: no-cache
    X-AspNet-Version: 4.0.30319
    X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com
    X-Powered-By: ASP.NET

    ```

