
# Web links
Web links are the key to resource navigation in UCWA 2.0.


 _**Applies to:** Skype for Business 2015_

The response to an HTTP request typically contains one or more web links, which are links to related resources. A web link can have the following attributes:

 **rel**

- Indicates a relationship to a resource and forms the unit of documentation. For example, the [conversation](conversation_ref.md) and [phoneAudio](phoneAudio_ref.md) resources.
 
- The most common values are **self** and **next**.
 
- Can be versioned (for future use).
 
 **href**

- Points to the HTTP URL of the resource. Can be relative or absolute.
 
 **title**

- Provides additional data in the link, such as DisplayName of a participant or audio source ID. Most resources do not have this attribute in their web links.
 

## JSON examples


```
{
 "conversation": {
 "href": "/ucwa/oauth/v1/applications/101246165550/communication/conversations/7c5c",
 }
}
{
 "participant": {
 "href": "/ucwa/oauth/v1/applications/101246165550/communication/conversations/7c5c/participants/johndoe@contoso.com",
 "title": "John Doe"
 }
}

```


## XML examples


```XML
<link rel="conversation" href="/ucwa/oauth/v1/applications/101246165550/communication/conversations/7c5c/" />
<link rel="participant" href="/ucwa/oauth/v1/applications/101246165550/communication/conversations/7c5c/participants/johndoe@contoso.com" title="John Doe" />

```

