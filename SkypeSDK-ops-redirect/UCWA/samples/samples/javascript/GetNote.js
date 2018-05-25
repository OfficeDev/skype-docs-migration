/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    opRes = new microsoft.rtc.ucwa.samples.OperationResource(ucwa.Transport, ucwa.Events),
    operationId = null;

    function handleGetNote(data) {
        if (data.results !== undefined) {
            $("#note").text(data.results.message);
        } else if (data.link) {
            ucwa.Transport.clientRequest({
                url: data.link.href,
                type: "get",
                callback: handleGetNote
            });
        }
    }

    $("#getNote").click(function() {
        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.me._links.note.href,
                type: "get",
                callback: handleGetNote
            });
        });

        return false;
    });

    $("#startOperation2").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            var raiser = {
                rel: 'note'
            },
            handlers = {
                started: handleGetNote,
                updated: handleGetNote
            };

            ucwa.Events.addEventHandlers(raiser, handlers);
            ucwa.Events.startEvents();
            $("#startOperation2").addClass("idleAnchor");
            $("#stopOperation2").removeClass("idleAnchor");
        }

        return false;
    });

    $("#stopOperation2").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            ucwa.Events.stopEvents();

            $("#startOperation2").removeClass("idleAnchor");
            $("#stopOperation2").addClass("idleAnchor");
        }

        return false;
    });
}());