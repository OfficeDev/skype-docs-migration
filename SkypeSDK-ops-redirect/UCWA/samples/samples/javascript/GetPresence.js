/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    opRes = new microsoft.rtc.ucwa.samples.OperationResource(ucwa.Transport, ucwa.Events),
    operationId = null;

    function handleGetPresence(data) {
        if (data.results !== undefined) {
            $("#presence").text(data.results.availability);
        } else if (data.link) {
            ucwa.Transport.clientRequest({
                url: data.link.href,
                type: "get",
                callback: handleGetPresence
            });
        }
    }

    $("#getPresence").click(function() {
        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.me._links.presence.href,
                type: "get",
                callback: handleGetPresence
            });
        });

        return false;
    });

    $("#startOperation1").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            var raiser = {
                rel: 'presence'
            },
            handlers = {
                started: handleGetPresence,
                updated: handleGetPresence
            };

            ucwa.Events.addEventHandlers(raiser, handlers);
            ucwa.Events.startEvents();

            $("#startOperation1").addClass("idleAnchor");
            $("#stopOperation1").removeClass("idleAnchor");
        }

        return false;
    });

    $("#stopOperation1").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            ucwa.Events.stopEvents();
            
            $("#startOperation1").removeClass("idleAnchor");
            $("#stopOperation1").addClass("idleAnchor");
        }

        return false;
    });
}());