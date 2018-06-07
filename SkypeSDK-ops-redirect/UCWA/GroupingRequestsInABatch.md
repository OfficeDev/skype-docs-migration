
# Grouping requests in a batch
The UCWA 2.0 batch resource can be used to bundle multiple HTTP requests into a single request.


 _**Applies to:** Skype for Business 2015_

The [batch](batch_ref.md) resource bundles multiple HTTP operations into one operation using multipart MIME (see [RFC 2046](https://www.ietf.org/rfc/rfc2046)). 

Batch requests are submitted as a single HTTP POST request on the batch resource. The batch request must contain a Content-Type header that specifies a content type of "multipart/batching" and a boundary specification.
The body of a batch request is made up of an ordered series of HTTP operations; this order will be preserved in the response. That said, it is important to note that the operations may execute on the server out of order. In the batch request body, each HTTP operation is represented as a distinct MIME part that is preceded by and followed by the boundary marker defined in the Content-Type header of the request. Each MIME part representing an HTTP operation within the batch includes both Content-Type and Content-Transfer-Encoding MIME headers. The batch request boundary is the value specified in the Content-Type Header for the batch.
The following is an example of a POST request on the batch resource. The batched requests are a GET request on the contacts of the user who is represented by an application (the contacts of the [me](me_ref.md) resource), and a GET request on the me resource itself.
For the sake of brevity, the application ID and boundary marker are abbreviated, and some request headers are not shown.



```
POST https://lyncweb.contoso.com/ucwa/oauth/v1/applications/103/batch HTTP/1.1
Accept: multipart/batching
Content-Type: multipart/batching;boundary=77f2569d
...

--77f2569d
Content-Type: application/http; msgtype=request

GET /ucwa/oauth/v1/applications/103/people/contacts HTTP/1.1
Host: lyncweb.contoso.com
Accept: application/json

--77f2569d
Content-Type: application/http; msgtype=request

GET /ucwa/oauth/v1/applications/103/me HTTP/1.1
Host: lyncweb.contoso.com
Accept: application/json


--77f2569d

```

