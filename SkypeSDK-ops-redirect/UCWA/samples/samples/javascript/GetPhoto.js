/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    $("#getPhoto").click(function() {
        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            var photoHref = cacheData._embedded.me._links.photo.href;

            if (photoHref !== "") {
                $("#mePhoto").html($("#contact-mini-template").tmpl({
                    image: ucwa.Transport.getDomain() + photoHref
                }));
            }else {
                alert("User photo has not been set!");
            }
        });

        return false;
    });
}());