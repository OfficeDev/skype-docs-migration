/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    $("#extendGroup").click(function() {
        if (window.site.subscribeToGroupPresence && !$("#extendGroup").hasClass("idleAnchor")) {
            ucwa.Transport.clientRequest({
                url: window.site.subscribeToGroupPresence + "&duration=11",
                type: "post",
                callback: function(data) {
                    if (data && data.results && data.results.rel && data.results.rel === "presenceSubscription") {
                        alert("Subscription has been extended!");
                    }
                }
            });
        }

        return false;
    });
}());