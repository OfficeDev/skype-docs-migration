/* Copyright (C) Microsoft 2014. All rights reserved. */
var domain = "https://www.example.com",
element = $("#frame")[0].contentWindow,
targetOrigin = "https://www.myDomain.com",
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),
Events = new microsoft.rtc.ucwa.samples.Event(Cache, Transport),
opRes = new microsoft.rtc.ucwa.samples.OperationResource(Transport, Events);

Transport.setElement(element, domain);

var startMessagingHref = "/ucwa/oauth/v1/applications/103645603125/communication/messagingInvitations",
request = {
    url: startMessagingHref,
    type: "post",
    data: imData
},
handlers = {
    started: function(data) {
        alert("started!");
    },
    completed: function(data) {
        alert("completed!");
    }
},
operationId = opRes.startOperation(request, handlers);

// After some time
opRes.stopOperation(operationId);