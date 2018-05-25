/* Copyright (C) Microsoft 2014. All rights reserved. */
var domain = "https://www.example.com",
targetOrigin = "https://www.myDomain.com",
container = $("<div id='frameContainer'></div>"),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),

AutoDiscovery = microsoft.rtc.ucwa.samples.AutoDiscovery(Transport);
AutoDiscovery.startDiscovery(domain, container, handleResult);

function handleResult(data) {
    if (data !== null) {
        // Can start authentication
    } else {
        // Something went wrong as it was unable to find AutoDiscoverService root
    }
}