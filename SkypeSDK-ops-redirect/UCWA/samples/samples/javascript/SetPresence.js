/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    function handleSetPresence(data) {
        if (data.status === 204 && data.statusText === "success") {
            alert("Status has changed, but you won't see it until you get it again!");
        }
    }

    $("#setPresence").click(function() {
        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.me._links.presence.href,
                type: "post",
                data: {
                    availability: $("#presenceValue").val()
                },
                callback: handleSetPresence
            });
        });

        return false;
    });
    
}());