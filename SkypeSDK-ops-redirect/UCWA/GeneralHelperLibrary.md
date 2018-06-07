
# GeneralHelper library
GeneralHelper.js is a JavaScript library of generally useful functions.


 _**Applies to:** Skype for Business 2015_

Use the functions in the GeneralHelper library to create namespaces, to check for null or undefined objects, and to generate unique numbers.

## Create a GeneralHelper object
<a name="sectionSection0"> </a>

A **GeneralHelper** object is created as shown in the following example.


```
var _generalHelper = new GeneralHelper(); 
```

The variable declared in the preceding example is used in subsequent examples in this topic.


## extractDataFromDataUri(uri, options)
<a name="sectionSection1"> </a>

The **extractDataFromDataUri** function extracts textual data from a Data URI.



|**Parameter**|**Description**|
|:-----|:-----|
|uri|The Data URI to be decoded.|
|options|The only option currently available is `options.unescape`. If set, replaces each escape sequence in the URI.|
 **Returns**: The string contained in the Data URI.

 **Syntax**




```
extractDataFromDataUri(uri , options )
```

 **Example**




```
function decodeMessage(message) {
 return _generalHelper.extractDataFromDataUri(message, { unescape: true });
}

```


### Remarks

In UCWA 2.0, Data URIs are used to transmit instant message bodies. For more information about Data URIs, see [the "data" URL scheme](http://tools.ietf.org/html/rfc2397).


## extractOriginFromAbsoluteUrl(url)
<a name="sectionSection2"> </a>

The **extractOriginFromAbsoluteUrl** function extracts the origin from an absolute URL.



|**Parameter**|**Description**|
|:-----|:-----|
|url|The URL from which to extract the origin.|
 **Returns**: The origin as a string or an empty string.

 **Syntax**




```
extractOriginFromAbsoluteUrl(url )
```

 **Example**




```
_domain = _generalHelper.extractOriginFromAbsoluteUrl(xframe);
```


### Remarks

An origin consists of SCHEME + "://" + HOST + (optional) ":" + (optional) PORT. The origin in the following URL is the portion shown in brackets. [https://example.com:8080]/some/long/path. For more information, see [The Web Origin Concept](http://tools.ietf.org/html/rfc6454), Section 3.2.1 Examples.


## generateUUID()
<a name="sectionSection3"> </a>

The **generateUUID** function generates a Universally Unique Identifier (UUID) based on the [RFC 4122](http://www.ietf.org/rfc/rfc4122.txt) specification.

 **Returns**: UUID that can be used as a unique object.

 **Syntax**




```
generateUUID()
```

 **Example**

The following example uses **generateUUID** to generate an operation ID. The operation ID and the target participant ( [to](to_ref.md)) are input values when **startOperation** is called.




```
imData.sessionContext = ucwa.GeneralHelper.generateUUID();
imData.to = $("#outgoingContacts option:selected") [0].value;
messagingId = opRes.startOperation({
 url: ucwa.Cache.findEmbeddedLinkInCache("communication", "startMessaging"),
 type: "post",
 data: imData
},
{
 started: function(data, resources) {
 handleMessagingStart(data, resources);
 },
 completed: function(data, resources) {
 handleMessagingStart(data, resources);
 }
});
```


## isDefined(object)
<a name="sectionSection4"> </a>

The **isDefined** function verifies that the supplied object is defined; specifically, that it is not **undefined** and not **null**.



|**Parameter**|**Description**|
|:-----|:-----|
|object|Object to check.|
 **Returns**: Boolean indicating whether the object is defined.

 **Syntax**




```
isDefined(object )
```

 **Example**

The following sample uses the **isDefined** function to first determine whether _data._embedded_is defined, and if so, to determine whether _data._embedded.message_is defined. If _data._embedded_is not defined, the second expression is not evaluated.




```
function findRelation(data) {
 if (_generalHelper.isDefined(data._embedded) &amp;&amp;
 _generalHelper.isDefined(data._embedded.message)) {
 // Do something.
 }
}
```


## isEmpty(object)
<a name="sectionSection5"> </a>

The **isEmpty** function determines whether the specified object is empty.



|**Parameter**|**Description**|
|:-----|:-----|
|object|Object to check.|
 **Returns**: Boolean indicating whether the object is empty.

 **Syntax**




```
isEmpty(object )
```

 **Example**

The following example shows how the **isEmpty** function can be used to check an expression before assigning its value to a variable.




```
if (data.results._embedded.contact &amp;&amp; !_generalHelper.isEmpty(data.results._embedded.contact)) {
 var contacts = data.results._embedded.contact;
 .
 .
 .
}
```


## namespace(namespaceString)
<a name="sectionSection6"> </a>

The **namespace** function generates an object placed in a namespace, based on the supplied string. This function splits the namespace string on '.' and begins iterating over the parts, creating a new object if necessary.



|**Parameter**|**Description**|
|:-----|:-----|
|namespaceString|Namespace to generate.|
 **Returns**: JSON object representing the namespace.

 **Syntax**




```
namespace(namespaceString )
```

 **Example**




```
_generalHelper. namespace("microsoft.rtc.ucwa.samples");

```

