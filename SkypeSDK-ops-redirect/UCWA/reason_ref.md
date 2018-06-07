# reason

 _**Applies to:** Skype for Business 2015_


Error response. This is never explicitly requested by the client - but the client will receive this in the event of an error.
            

## Web Link
<a name = "sectionSection0"> </a>

For more on web links, see [Web links](WebLinks.md).


|**Name**|**Description**|
|:-----|:-----|
|rel|The resource that this link points to. In JSON, this is the outer container.|
|href|The location of this resource on the server, and the target of an HTTP operation.|

### Properties



|**Name**|**Description**|
|:-----|:-----|
|code|Gets the error code.|
|message|Gets the error message.|
|subcode|Gets the error subcode.|

### Links



This resource can have the following relationships.

|**Link**|**Description**|
|:-----|:-----|
|self|The link to the current resource.|

## Operations



<a name="sectionSection2"></a>

### GET





#### Response body



The response from a GET request contains the properties and links shown in the Properties and Links sections at the top of this page.

#### Synchronous errors



The errors below (if any) are specific to this resource. Generic errors that can apply to any resource are covered in [Generic synchronous errors](GenericSynchronousErrors.md).


#### Examples




