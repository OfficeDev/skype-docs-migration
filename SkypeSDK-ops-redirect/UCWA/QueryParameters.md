
# Query Parameters
Some UCWA 2.0 resources require requests that take query parameters.


 _**Applies to:** Skype for Business 2015_

For some resources or operations, a client application can pass query parameters in an HTTP request. The client should avoid string manipulation to add the query parameters, as this can potentially lead to errors. For example, if there is already a server-supplied query parameter, and you append another query parameter, the URL could end up with two '?' characters in it, making the URL invalid. The recommended way to add query parameters is by using a proper URL parser.

>Note: Some URLs in the links might already have query parameters that were added by the server for various reasons. It is important for the client to preserve these server-added query parameters without changing their values. 

## Query parameters in POST requests

For POST requests to UCWA 2.0, input can be specified in the request body or as one or more query parameters of the request. The following example shows a POST request on the [note](note_ref.md) resource, with the input values in the request body.


```
POST https://lyncweb.contoso.com/ucwa/oauth/v1/applications/101/me/note HTTP/1.1
 .
 .
 .

{"message":"I'm away from the office today"}
```

The next example shows a POST request on the **note** resource, with a query parameter in the query string.




```
POST https://lyncweb.contoso.com/ucwa/v1/applications/113/me/note? Message=I'm%20away%20today HTTP/1.1

```


## Query parameters in GET requests

For GET requests, input can be specified only as query parameters, because a GET request cannot have a body. This example shows a GET request on the [search](search_ref.md) resource, with two query parameters in the query string.


```
GET https://lyncweb.contoso.com/ucwa/oauth/v1/applications/103/people/search? query=jdoe@contoso.com&amp;limit=3 HTTP/1.1
 .
 .
 .

```

