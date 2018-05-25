
# HTTP
The basic operations in Microsoft Unified Communications Web API 2.0 are HTTP requests and responses.


 _**Applies to:** Skype for Business 2015_

The Hypertext Transfer Protocol (HTTP) is an application protocol that is the foundation of data communication for the web. Microsoft Unified Communications Web API 2.0 leverages HTTP as an application protocol rather than as a transport protocol. The [HTTP RFC](http://www.w3.org/Protocols/rfc2616/rfc2616.mdl) defines the HTTP protocol in detail and contains several recommendations for clients and server components to follow. The UCWA 2.0 protocol is based on the HTTP protocol but makes use of only a small subset of the features that are relevant for the API. For example, UCWA 2.0 does not support HTTP verbs such as OPTIONS, HEAD, or TRACE, or many of the header names that are not relevant for the API. However, intermediate proxies and other edge servers might leverage other features of the HTTP protocol. The RFC provides more details about all of the verbs and headers that are defined for HTTP.


## HTTP operations

The Microsoft Unified Communications Web API 2.0 follows the REST model for manipulating resources. The HTTP verbs POST, GET, PUT, and DELETE are used to create, read, update and delete resources. The create, read, update, and delete operations are sometimes referred to as CRUD ( **C**reate, **R**ead, **U**pdate, and **D**elete) operations.


### POST

The POST verb is often used on a collection resource to create a member resource of the collection. For example, a client application can send a POST request on the link for [myOnlineMeetings](myOnlineMeetings_ref.md) resource to create a scheduled online meeting. It is also used to initiate processes, like sending an instant message (IM) with [sendMessage](sendMessage_ref.md).


### GET

The GET verb is used to retrieve a resource.


### PUT

The PUT verb is used to update the resource. The PUT operation requires the client to supply all of the properties (including those that are not understood by the client application) of the resource for the update operation to succeed. This is to ensure that new properties added in the future versions are preserved by older clients that do not understand them.


### DELETE

The DELETE verb is used to delete a resource. To delete a specific online meeting, the client application can use DELETE verb on the URL of the [myOnlineMeeting](myOnlineMeeting_ref.md) resource instance.


## HTTP headers

UCWA 2.0 makes use of several HTTP headers. A brief explanation of relevant headers is provided here. For more information, see the [HTTP RFC](http://www.w3.org/Protocols/rfc2616/rfc2616.mdl).


- Accept - Used by clients to state which format is preferred in the response body of an HTTP operation.
 
- Authorization - Used by clients to provide credentials on each request.
 
- Content-Type: Used by client or server to indicate the format of the body of an HTTP operation.
 
- Etag - Used to keep track of changes in resources and to prevent overwriting changes when performing a PUT. All UCWA resources require the playback of the Etag when performing a PUT. 
 
- Expires - Used by some resources to indicate how long the client should cache them.
 
- If-Match - Used by clients when performing a PUT to prevent overwriting of changes to a resource. The resource's etag is provided as the value.
 
- WWW-Authenticate - Used by the server to inform clients of how they can authenticate. 
 
- X-MS-RequiresMinResourceVersion - Used by the client to specify the minimum version of a resource it can understand.
 
- If-None-Match - Used by clients in a GET request to reduce data transfer for resources that do not change often. The resource's etag is provided as the value.
 
