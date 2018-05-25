
# Batch library
Batch.js is a JavaScript library that helps combine multiple HTTP requests into a single batch request.


 _**Applies to:** Skype for Business 2015_

Use the functions in the Batch library to package multiple HTTP requests into a single request using a Transport object. For more information, see [Transport library](TransportLibrary.md). 
Batch.js has a queuing mechanism that stores up to 20 requests before sending. The queue can also be sent as a result of a timer elapsing. The timer defaults to 3 minutes.

## Create a Batch object
<a name="sectionSection0"> </a>

To create a **Batch** object, you must first create **Cache** and **Transport** objects, as in the following sample. For more information, see [Cache library](CacheLibrary.md) and [Transport library](TransportLibrary.md).


```
var targetOrigin = "https://www.myDomain.com",
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),
timerLimit = 2000,
Batch = new microsoft.rtc.ucwa.samples.Batch(Cache, Transport, timerLimit);
```

The variables declared in the preceding example are used in subsequent examples in this topic.


## processBatch()
<a name="sectionSection1"> </a>

The **processBatch** function processes any operations that were previously placed on the batch queue.

 **Syntax**




```
processBatch()
```

 **Example**




```
Batch.processBatch();
```


### Remarks

The **processBatch** function checks to see if the batch queue has any outstanding requests. If so, it begins immediate processing. If a timer was active it will be cleared. After the batch request is sent, the queue is cleared.


## queueRequest(request)
<a name="sectionSection2"> </a>

The **queueRequest** function places an HTTP request on the queue to be sent at a later time.



|**Parameter**|**Description**|
|:-----|:-----|
|request|HTTP request object.|
 **Syntax**




```
queueRequest(request)
```

The _request_parameter is an HTTP request object, as in the following example.

 **Example**

The _request_object will be changed into a Message object and then put on the batch queue. If the queue reaches its limit on the number of requests, it will immediately start to process any outstanding requests. Otherwise, a timer starts; at the end of a specified period, the items in the queue are processed automatically.




```
Batch.queueRequest({
 url: "https://www.example.com/ucwa/myLink",
 type: "get",
 callback: function(data) {
 alert("I got myLink!");
 }
});
Batch.queueRequest({
 url: "https://www.example.com/ucwa/myLink2",
 type: "post",
 data: {
 value: "123",
 day: "Tuesday"
 },
 acceptType: "application/json",
 callback: function(data) {
 alert("I posted myLink2!");
 }
});
```


### Remarks

The request parameter should be an object in the form of:


```
{
 url: "myLink", // HTTP request URL
 verb: "get", // One of get, post, put, or delete.
 acceptType: "application/json", // Optional. This is the default value.
 contentType: "application/json", // Optional. This is the default value.
 data: "hello world", // Any kind of JSON data.
 callback: myCallback, // Optional
 notifyAction: true // Optional. Values are true or false.
}
```

The request object will be put on the batch queue. If the queue size is greater than 20, outstanding requests are processed immediately. If not, a timer starts to facilitate batch processing.

