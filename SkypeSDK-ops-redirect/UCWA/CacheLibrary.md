
# Cache library
Cache.js is a JavaScript library that helps store and retrieve frequently used resource URLs for later use.


 _**Applies to:** Skype for Business 2015_

Use the functions in the Cache library to read data from or write data to a cookie or to HTML 5 local storage.
The cache has two parts:

1. A links cache that is used to keep track of singleton resources such as [application](application_ref.md), [batch](batch_ref.md), or [events](events_ref.md).
 
2. A data cache that is used for resources that are delivered in the event channel.
 
The links cache is indexed by resource name; the data cache is indexed by href.
Often, application latency can be decreased by accessing links or embedded resources that have previously been cached, rather than sending another HTTP request to get them.

## Create a Cache object
<a name="sectionSection0"> </a>

A **Cache** object is created as shown in the following example.


```
var Cache = new microsoft.rtc.ucwa.samples.Cache();
```

The variable declared in the preceding example is used in subsequent examples in this topic.


## cacheLinks(data)
<a name="sectionSection1"> </a>

The **cacheLinks** function caches links based on the supplied data.



|**Parameter**|**Description**|
|:-----|:-----|
|data|The data object to be stored in the cache.|
 **Syntax**




```
cacheLinks(data )
```

 **Example**

The object shown in this example is used in the two examples that follow it.




```
data = {
 rel : "contact",
 name : "John Doe",
 _links: {
 self: {href: "/people/johndoe@contoso.com"},
 contactLocation: {href: "/people/johndoe@contoso.com/contactLocation"}
 },
 _embedded: {
 presence: {
 _links: {
 self: {href: "/people/johndoe@contoso.com/presence"},
 jean: {href: "/people/jeandoe@contoso.com/presence"}
 }
 }
 }
};
```

In the following example, the _self_object under the outer __links_key is stored in the cache.




```
Cache.cacheLinks(data._links);
```

In the next example, the _presence_object under the __embedded_key is stored in the cache.




```
Cache.cacheLinks(data._embedded);
```


### Remarks

This function attempts to save data into local storage or a cookie. This should be used only for singleton resources. 

If there is a collision between a link to be cached and one already in the cache, the existing one will be overwritten.


## findEmbeddedLinkInCache(target, resource)
<a name="sectionSection2"> </a>

The **findEmbeddedLinkInCache** function finds a resource link stored in the singleton cache of embedded data. This function gets the JSON links from the cache, to check whether the resource exists in the embedded target resource.



|**Parameter**|**Description**|
|:-----|:-----|
|target|Target embedded resource.|
|resource|Link to find in the embedded resource.|
 **Returns:** Resource link if found, or an empty string.

 **Syntax**




```
findEmbeddedLinkInCache(target , rel )
```

 **Example**

The next example uses the following definition.




```
data = {
 rel : "contact",
 name : "John Doe",
 _links: {
 self: {href: "/people/johndoe@contoso.com"},
 contactLocation: {href: "/people/johndoe@contoso.com/contactLocation"}
 },
 _embedded: {
 presence: {
 _links: {
 self: {href: "/people/johndoe@contoso.com/presence"},
 jean: {href: "/people/jeandoe@contoso.com/presence"}
 }
 }
 }
};
```

In the following example, _link_will be set to "/people/jeandoe@contoso.com/presence".




```
var link = Cache.findEmbeddedLinkInCache("presence", "jean");
```


## findLinkInCache(resource)
<a name="sectionSection3"> </a>

The **findLinkInCache** function finds a resource link stored in the singleton cache. This function gets the JSON links from the cache, and determines whether the resource link exists.



|**Parameter**|**Description**|
|:-----|:-----|
|resource|Link to find in the cache.|
 **Returns:** Resource link if found, or an empty string.

 **Syntax**




```
findLinkInCache(rel )
```

 **Example**

The next example uses the following definition.




```
data = {
 rel : "contact",
 name : "John Doe",
 _links: {
 self: {href: "/people/johndoe@contoso.com"},
 contactLocation: {href: "/people/johndoe@contoso.com/contactLocation"}
 },
 _embedded: {
 presence: {
 _links: {
 self: {href: "/people/johndoe@contoso.com/presence"},
 jean: {href: "/people/jeandoe@contoso.com/presence"}
 }
 }
 }
};
```

After the following example runs, _link_will be set to /people/johndoe@contoso.com/contactLocation".




```
var link = Cache.findLinkInCache("contactLocation");
```


## findLinkInResource(rel, data)
<a name="sectionSection4"> </a>

The **findLinkInResource** function looks for a "rel" link that is stored in the singleton cache.



|**Parameter**|**Description**|
|:-----|:-----|
|rel|The relation type of the link to find in the data object.|
|data|The data object to be searched.|
 **Returns:** The "rel" link if found, or an empty string.

 **Syntax**




```
findLinkInResource(rel , data )
```

 **Example**

The next example uses the following definition.




```
data = {
 rel : "contact",
 name : "John Doe",
 _links: {
 self: {href: "/people/johndoe@contoso.com"},
 contactLocation: {href: "/people/johndoe@contoso.com/contactLocation"}
 },
 _embedded: {
 presence: {
 _links: {
 self: {href: "/people/johndoe@contoso.com/presence"},
 joan: {href: "/people/jeandoe@contoso.com/presence"}
 }
 }
 }
};
```

After the following example runs, link will be set to "/people/johndoe@contoso.com/contactLocation".




```
var link = Cache.findLinkInResource("contactLocation", data);
```


### Remarks

This function searches the data object for "_links". If found, the function searches for a link with the given "rel".


## read(href)
<a name="sectionSection5"> </a>

The **read** function retrieves data received by way of the event channel from the cache using the _href_as a key.



|**Parameter**|**Description**|
|:-----|:-----|
|href|Link to find in the cache.|
 **Returns:** The data from the cache or an empty string ("").

 **Syntax**




```
read(href )
```

 **Example**

The following two examples for the **read** function use this definition.




```
var eventData1 = {
 link : {
 rel : "contact",
 href : "/people/johndoe@contoso.com"
 },
 type : "added",
 _embedded : {
 "contact" : {
 name : "John Doe",
 title : "Programmer",
 _links: {
 self: {href: "/people/johndoe@contoso.com"},
 contactPhoto : {href: "/photos/johndoe@contoso.com"}
 },
 }
 }
};
```

After the next example runs, _link1_will be set to "/people/johndoe@contoso.com".




```
var link1 = Cache.read(eventData1.link.href);
```

After the following example runs, _link2_will be set to "/photos/johndoe@contoso.com".




```
var link2 = Cache.read(eventData1._embedded.contact._links.contactPhoto.href);
```


## write(data)
<a name="sectionSection6"> </a>

The **write** function writes object data received by way of the event channel to the cache using the href as the key.



|**Parameter**|**Description**|
|:-----|:-----|
|data|The JSON object representation of an event.|
 **Returns:** The data object written to the cache.

 **Syntax**




```
write(data )
```

 **Example**




```
eventData2 = {
 link : {
 rel : "contact",
 href : "/people/johndoe@contoso.com"
 },
 type : "added"
};
```

The following example writes the data in the _eventData2_object to the cache. Note that in this example, the value that is returned by **write** is discarded.




```
Cache.write(eventData2);
```


### Remarks

If no embedded data is provided, the cache entry will be marked dirty. If the entry exists, it will be updated accordingly. If it does not exist, it will be created.

