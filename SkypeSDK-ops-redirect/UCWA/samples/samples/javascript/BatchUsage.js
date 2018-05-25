/* Copyright (C) Microsoft 2014. All rights reserved. */
var domain = "https://www.example.com",
targetOrigin = "https://www.myDomain.com",
timerLimit = 4000,
element = $("#frame")[0].contentWindow,
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),
Batch = new microsoft.rtc.ucwa.samples.Batch(Cache, Transport, timerLimit);

Transport.setElement(element, domain);
// (Fake) credentials are hard-coded in this example, but should normally be acquired programmatically.
Transport.setAuthorization("cwt=AAEBHAEFAAAAAAAFFQAAACZfw6hMpZ-w7RAMgdAEAACBEPDttJWHCThQn95OJLXgmL2CAvrFgyAMij1C0fFgd9JBx2_VpSjC0fUJFOK02BUWty33xAQH34YIAieH80cSzwg", "Bearer");

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

// Could also wait out the timer limit of 3 seconds...
Batch.processBatch();