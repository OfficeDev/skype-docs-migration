/* Copyright (C) Microsoft 2014. All rights reserved. */
var domain = "https://www.example.com",
targetOrigin = "https://www.myDomain.com",
element = $("#frame")[0].contentWindow,
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),
AutoDiscovery = new microsoft.rtc.ucwa.samples.AutoDiscovery(Transport);

Transport.setElement(element);

var Application = {
    userAgent: "UCWA Samples",
    endpointId: this.GeneralHelper.generateUUID(),
    culture: "en-US"
};

AutoDiscovery.startDiscovery(domain, element, handleAutoDiscovery);
var Authentication = new microsoft.rtc.ucwa.samples.Authentication(Cache, Transport);

function handleAutoDiscovery(link) {
    Authentication.setCredentials("username", "password");
    Authentication.start(link, Application, handleResult);
}

function handleResult(isAuthenticated, data) {
    if (isAuthenticated && data.statusText === "success") {
        // Handle logged in state...
    } else {
        // Handle issue with logging in...
    }
}