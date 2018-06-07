/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    function handleGetSingleContacts(data) {
        if (data.results !== undefined) {
            var contacts = data.results._embedded.contact;

            if (contacts !== undefined && !ucwa.GeneralHelper.isEmpty(contacts)) {
                if ($.isArray(contacts)) {
                    for (var contact in contacts) {
                        var contactText = contacts[contact].name ? contacts[contact].name : "Contact: " + contact;
                        $("#singleContactsList").append($("<option></option>", { value: contacts[contact]._links.self.href }).text(contactText));
                    }
                } else {
                    var contactText = contacts[contact].name ? contacts[contact].name : "Contact: " + contact;
                    $("#singleContactsList").append($("<option></option>", { value: contacts._links.self.href }).text(contactText));
                }

                $("#singleContactsList").show();
                $("#getSingleContact").removeClass("idleAnchor");
            } else {
                alert("No contacts found!");
            }
        }

        $("#singleContactsList").show();
        $("#getSingleContact").removeClass("idleAnchor");
    }

    function handleSingleContact(data) {
        if (data.results !== undefined) {
            var contact = data.results;
            $("#singleContact").html($("#contact-template").tmpl({
                name: contact.name,
                email: contact.emailAddresses ? contact.emailAddresses[0] : "(None)",
                image: contact._links.contactPhoto ?  ucwa.Transport.getDomain() + contact._links.contactPhoto.href : null
            }));
        }
    }

    $("#getSingleContacts").click(function() {
        $("#singleContactsList").html("");

        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.people._links.myContacts.href,
                type: "get",
                callback: handleGetSingleContacts
            });
        });

        return false;
    });

    $("#getSingleContact").click(function() {
        if ($("#singleContactsList option:selected").length === 1 && !$("#getSingleContact").hasClass("idleAnchor")) {
            ucwa.Transport.clientRequest({
                url: $("#singleContactsList option:selected").val(),
                type: "get",
                callback: handleSingleContact
            });
        }

        return false;
    });

    $("#singleContactsList").hide();
}());