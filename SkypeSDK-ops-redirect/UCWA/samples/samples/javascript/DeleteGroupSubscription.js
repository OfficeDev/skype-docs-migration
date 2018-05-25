/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    $("#deleteGroup").click(function() {
        if (window.site.groupPresenceSubscriptionLink && !$("#deleteGroup").hasClass("idleAnchor")) {
            ucwa.Transport.clientRequest({
                url: window.site.groupPresenceSubscriptionLink,
                type: "delete",
                callback: function(data) {
                    window.site.groupPresenceSubscriptionLink = null;
                    ucwa.Events.stopEvents();
                    $("#extendGroup").addClass("idleAnchor");
                    $("#deleteGroup").addClass("idleAnchor");
                    $("#groupSubscribed").html("");
                    alert("Subscription has been deleted!");
                }
            });
        }

        return false;
    });
}());