/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    $("#deleteAdHoc").click(function() {
        if (window.site.adHocSubscriptionLink && !$("#deleteAdhoc").hasClass("idleAnchor")) {
            ucwa.Transport.clientRequest({
                url: window.site.adHocSubscriptionLink,
                type: "delete",
                callback: function(data) {
                    window.site.adHocSubscriptionLink = null;
                    ucwa.Events.stopEvents();
                    $("#extendAdHoc").addClass("idleAnchor");
                    $("#deleteAdHoc").addClass("idleAnchor");
                    $("#adHocSubscribed").html("");
                    alert("Subscription has been deleted!");
                }
            });
        }

        return false;
    });
}());