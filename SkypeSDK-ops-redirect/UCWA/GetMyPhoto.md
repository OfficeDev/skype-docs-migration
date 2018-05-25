
# Get my photo
Get the **me** user's photo.


 _**Applies to:** Skype for Business 2015_

Getting a user's photo involves resource navigation from [application](application_ref.md) to [me](me_ref.md) to [photo](photo_ref.md). 

The steps here assume that you have already created an application and have received a response that contains the href for an [application](application_ref.md) resource. For more information, see [Create an application](CreateAnApplication.md).

1. Send a POST request on the makeMeAvailable resource.
 
  One of the hypermedia links that are served in the response for the [application](application_ref.md) resource is the HREF for the [makeMeAvailable](makeMeAvailable_ref.md) resource, which can be found in the embedded me resource.
 
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
 
 You should receive a response code of 200 OK. The following is a typical response to the previous GET request. The photo link in the response will be used in a subsequent step, so it is important to cache it. For brevity, some parts of the response body are omitted, and IDs and tokens are shortened.
 
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
    "note":{"href":"/ucwa/oauth/v1/applications/101/me/note"},
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

5. Send a GET request on the **photo** resource. Note that, for browsers, this typically consists of creating an <img> tag and populating its src attribute with the photo's absolute URL.
 
 A sample request is shown here.
 
    ```
    GET https://lyncweb.contoso.com/ucwa/oauth/v1/applications/102035238221/photos/Dana@contoso.com HTTP/1.1
    Accept: */*
    Referer: http://server/
    Accept-Language: en-US
    User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.2; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3)
    Accept-Encoding: gzip, deflate
    Host: lyncweb.contoso.com
    DNT: 1
    Connection: Keep-Alive
    Cookie: cwt_ucwa=AAEB...G9z

    ```

6. Process the response from the previous GET request. The photo contents are returned in the response body. Note that if the browser method mentioned previously is used, the application is not required to do any further processing. 
 
 The response you receive should be 200 OK. 
 
    ```
    HTTP/1.1 200 OK
    Connection: Keep-Alive
    Transfer-Encoding: chunked
    Expires: Thu, 17 Jan 2013 00:00:00 GMT
    Date: Thu, 17 Jan 2013 00:00:00 GMT
    Content-Type: image/jpeg
    Server: Microsoft-IIS/7.5
    Cache-Control: private
    X-Exchange-FEServer: W15-EXCH
    X-Exchange-request-id: e4c5...5240
    X-Exchange-TargetBEServer: w15-exch.contoso.com
    X-AspNet-Version: 4.0.30319
    X-MS-Server-Fqdn: W15-LYNC-SE1.contoso.com
    X-Powered-By: ASP.NET
    Content-Length: 11434
    <Photo data in body not shown>
    ```

