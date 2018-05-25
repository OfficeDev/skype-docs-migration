
# Generic synchronous errors
Some HTTP requests on UCWA resources can produce a response that indicates an error. This topic lists the common errors that can appear synchronously (in the HTTP response).


 _**Applies to:** Skype for Business 2015_

The errors listed in the following table apply to most resources.



|**Error**|**Description**|
|:-----|:-----|
|ApplicationNotFound|The application resource does not exist.|
|BadRequest|Something is wrong with the entire request (malformed XML/JSON, for example).|
|DeserializationFailure|The request body could not be deserialized. Please check if the body confirms to allowed formats and does not have any invalid characters.|
|EntityTooLarge|The request is too large.|
|ExchangeServiceFailure|Exchange connectivity failure.|
|InactiveApplicationExpired|An inactive application expired.|
|MethodNotAllowed|The requested HTTP method is not supported for this resource.|
|MobileApplicationNoLongerAllowed|User is no longer authorized for mobile applications.|
|ParameterValidationFailure|A parameter value is not valid.|
|PreconditionFailed|An If-Match precondition was not met.|
|PreconditionRequired|The operation requires an If-Match precondition.|
|ResourceNotFound|The resource does not exist.|
|ServiceFailure|Internal Server Error.|
|ServiceTimeout|Internal Server Error, remote timeout.|
|TooManyApplications|There are too many applications for this user.|
|UnsupportedMediaType|The content-type is not supported.|
|VersionNotSupported|Requested Version is not supported.|
