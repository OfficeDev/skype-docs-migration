/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    function handleSetNote(data) {
        if (data.status === 204 && data.statusText === "success") {
            alert("Note has changed, but you won't see it until you get it again!");
        }
    }

    $("#setNote").click(function() {
        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.me._links.note.href,
                type: "post",
                data: {
                    message: $("#noteValue").val()
                },
                callback: handleSetNote
            });
        });

        return false;
    });
}());