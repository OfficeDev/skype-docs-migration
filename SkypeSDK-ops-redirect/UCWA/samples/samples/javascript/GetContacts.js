/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    function handleGetContacts(data) {
        if (data.results !== undefined) {
            var contacts = data.results._embedded.contact;

            if (contacts !== undefined) {
                if ($.isArray(contacts)) {
                    for (var contact in contacts) {
                        handleContactListItem(contacts[contact]);
                    }
                } else {
                    handleContactListItem(contacts);
                }
            } else {
                alert("No contacts found!");
            }
        }
    }

    function handleContactListItem(data) {
        if (data !== undefined) {
            $("#contactList").append($("#contact-template").tmpl(parseContact(data)));
        }
    }

    function parseContact(data) {
        var contact = {
            name: data.name,
            email: data.emailAddresses ? data.emailAddresses[0] : "",
            image: data._links.contactPhoto ? ucwa.Transport.getDomain() + data._links.contactPhoto.href : null
        };

        return contact;
    }

    $("#getContacts").click(function() {
        $("#contactList").html("");

        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.people._links.myContacts.href,
                type: "get",
                callback: handleGetContacts
            });
        });

        return false;
    });
}());