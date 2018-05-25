
# AutoDiscovery library
AutoDiscovery.js is a JavaScript library that helps an application find the Microsoft Unified Communications Web API 2.0 home server.


 _**Applies to:** Skype for Business 2015_

Use the functions in the AutoDiscovery module to discover the correct location of the AutoDiscover service and set up a **Transport** object with the correct final domain. For more information, see [Transport library](TransportLibrary.md).


## Create an AutoDiscovery object



The **AutoDiscovery** constructor has one parameter: a **Transport** object. Before an **Autodiscovery** object can be created, an object representing the parameter must be created.




```
var domain = "https://www.example.com",
targetOrigin = "https://www.consoso.com",
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin);
AutoDiscovery = microsoft.rtc.ucwa.samples.AutoDiscovery(Transport);

```

The variables declared in the preceding example are used in subsequent examples in this topic.


## startDiscovery(domain, container, callback)

The **startDiscovery** function is the starting point for auto-discovery.



|**Parameter**|**Description**|
|:-----|:-----|
|domain|FQDN to use during auto-discovery.|
|container|DOM element that will contain the injected iframe(s).|
|callback|Method to execute when auto-discovery completes.|
 **Syntax**




```
startDiscovery(domain, container, callback)
```

 **Example**




```
function handleResult(data) {
 if (data !== null) {
 // Can start authentication.
 } else {
 // Something went wrong as it was unable to find AutoDiscoverService root.
 }
}
AutoDiscovery.startDiscovery(domain, container, handleResult);
```


### Remarks

The **startDiscovery** function stores the supplied callback, and begins the internal processing of auto-discovery.

