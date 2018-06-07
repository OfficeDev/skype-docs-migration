/* Copyright (C) Microsoft 2014. All rights reserved. */
var domain = "https://www.example.com",
element = $("#frame")[0].contentWindow,
targetOrigin = "https://www.myDomain.com",
Cache = new microsoft.rtc.ucwa.samples.Cache(),
Transport = new microsoft.rtc.ucwa.samples.Transport(targetOrigin),
Events = new microsoft.rtc.ucwa.samples.Event(Cache, Transport);

Transport.setElement(element, domain);

Events.updateEventOptions({
    low: 120,
    medium: 180,
    timeout: 360
});

var raiser = {
    href: '/me/presence'
},
handlers = {
    started: handlePresence,
    updated: handlePresence
};

Events.addEventHandlers(raiser, handlers);
Events.startEvents();

function handlePresence(data) {
    if (data.results !== undefined) {
        alert(data.results);
    }
}

Events.addEventHandlers({
    rel: "message"
},
{
    completed: function() {
        return false;
    }
});

// After some time
Events.removeEventHandlers("message");

// After some time
Events.stopEvents();