/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa;

    function handleSearchContacts(data) {
        if (data.results._embedded) {
            $("#searchedContactsList").html($("#contact-template").tmpl(parseSearchedContacts(data.results._embedded.contact)));
        } else {
            $("#searchedContactsList").html($("<p></p>").html("* No contacts found for: " + $("#contactSearchValue").val()).addClass("errorText"));
        }
    }

    function parseSearchedContacts(contactsData) {
        var contacts = [];

        if (contactsData.length) {
            for (var item in contactsData) {
                contacts.push(processSingleContact(contactsData[item]));
            }
        } else {
            contacts.push(processSingleContact(contactsData));
        }

        return contacts;
    }

    function processSingleContact(contactData) {
        var contact = {
            name: contactData.name,
            email: contactData.emailAddresses ? contactData.emailAddresses[0] : "(None)",
            image: contactData._links.contactPhoto ? ucwa.Transport.getDomain() + contactData._links.contactPhoto.href : null
        };

        return contact;
    }

    $("#searchContacts").click(function() {
        var searchValue = $("#contactSearchValue").val();

        if (searchValue !== "") {
            ucwa.Cache.read({
                id: "main"
            }).done(function(cacheData) {
                ucwa.Transport.clientRequest({
                    url: cacheData._embedded.people._links.search.href + "?query=" + searchValue + "&limit=3",
                    type: "get",
                    callback: handleSearchContacts
                });
            });
        }

        return false;
    });
}());