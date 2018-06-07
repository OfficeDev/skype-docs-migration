
# removeContactFromAllGroups


Removes all group memberships that a contact belongs to.


## Web link
<a name="sectionSection0"> </a>

For more on web links, see [Web links](WebLinks.md).



|**Name**|**Description**|
|:-----|:-----|
|rel|The resource that this link points to. In JSON, this is the outer container.|
|href|The location of this resource on the server, and the target of an HTTP operation.|

## Resource description
<a name="sectionSection1"> </a>




### Properties

None


### Links

None


## Operations
<a name="sectionSection2"> </a>




### POST

Removes all group memberships that a contact belongs to.


#### Query parameters

|**Name**|**Description**|**Required?**|
|:-----|:-----|:-----|
|contactUri|The maximum length is 250 characters.|Yes|

#### Request body

|**Name**|**Description**|**Required?**|
|:-----|:-----|:-----|
|contactUri|The maximum length is 250 characters.|Yes|

#### Response body

None


#### Synchronous errors

The errors below, if any, are specific to this resource. Generic errors that can apply to any resource are covered in [Generic synchronous errors](GenericSynchronousErrors.md).



|**Error**|**Code**|**Subcode**|**Description**|
|:-----|:-----|:-----|:-----|
|ServiceFailure|500|CallbackChannelError||
|Conflict|409|AlreadyExists||
|Conflict|409|TooManyGroups||
|Conflict|409|None||

#### Examples




#### JSON Request


```
Post https://fe1.contoso.com:443/v1/applications/183/myGroupMemberships/removeContactFromAllGroups HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com
```


#### JSON Response

This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.


```
HTTP/1.1 204 No Content

```


#### XML Request


```
Post https://fe1.contoso.com:443//v1/applications/183/myGroupMemberships/removeContactFromAllGroups HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com
```


#### XML Response

This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.


```
HTTP/1.1 204 No Content

```

