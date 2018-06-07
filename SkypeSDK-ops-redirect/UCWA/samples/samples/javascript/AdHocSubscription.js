/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    batch = new microsoft.rtc.ucwa.samples.Batch(ucwa.Cache, ucwa.Transport),
    presenceColors = {
        Online: "rgb(124,209,100)",
        Away: "rgb(255,222,78)",
        BeRightBack: "rgb(255,222,78)",
        Busy: "rgb(194,58,43)",
        DoNotDisturb: "rgb(194,58,43)",
        Offline: "rgb(182,207,216)",
        Unknown: "rgb(182,207,216)"
    },
    inMemoryPresence = {};

    function determineContactId(inString) {
        var reSlash = /\//gi,
        reDot = /\./gi,
        reAt = /@/gi,
        replacewith = "_";
        return inString.slice(0,inString.lastIndexOf(".")).replace(reSlash,replacewith).replace(reAt,replacewith).replace(reDot,replacewith);
    }

    function handleAdHocContacts(data) {
        if (data.results !== undefined && data.results._embedded !== undefined && data.results._embedded.contact !== undefined) {
            if ($.isArray(data.results._embedded.contact)) {
                for (var contact in data.results._embedded.contact) {
                    handleAdHocBatch({results : data.results._embedded.contact[contact]});
                }
            } else {
                handleAdHocBatch(data.results._embedded.contact);
            }

            batch.processBatch();
        } else {
            $("#adHocContacts").parent().removeClass("controls");
            $("#adHocContacts").parent().html($("<p></p").html("* Add contacts and reload to enable this task").addClass("errorText"));
            $("#subscribeAdhoc").addClass("idleAnchor");
        }
    }

    function handleAdHocBatch(data) {
        if (data !== undefined) {
            var contact = parseAdHocContact(data.results);
            $("#adHocContacts").append($("<option></option>", { value: JSON.stringify(contact) }).text(contact.name));
        }
    }

    function parseAdHocContact(data) {
        var contact = {
            id: determineContactId(data._links.self.href),
            name: data.name,
            uri : data.uri
        };

        return contact;
    }

    function processAdhoc() {
        var contacts = $("#adHocContacts option:selected");

        if (contacts.length >= 1) {
            var sips = [];
            var contactsData = [];

            for (var item in contacts) {
                if (contacts.hasOwnProperty(item) && contacts[item].value !== undefined) {
                    var data = JSON.parse(contacts[item].value);
                    sips.push(data.uri);
                    data.type = "adHoc";
                    contactsData.push(data);
                }
            }

            $("#adHocSubscribed").html($("#contact-presence-template").tmpl(contactsData));

            for (var item in contactsData) {

                $("#adHoc" + contactsData[item].id).css("border-left-color", inMemoryPresence[contactsData[item].id] || presenceColors.Unknown);
            }

            ucwa.Events.addEventHandlers({
                rel: "contactPresence"
            },
            {
                updated: function(data) {
                    if (data.link) {
                        ucwa.Transport.clientRequest({
                            url: data.link.href,
                            type: "get",
                            callback: function(data) {
                                var id = determineContactId(data.results._links.self.href),
                                element = $("#adHoc" + id),
                                presenceColor = presenceColors[data.results.availability];

                                inMemoryPresence[id] = presenceColor;

                                if (element.length !== 0) {
                                    element.css("border-left-color", presenceColor);
                                }
                            }
                        });
                    }
                }
            });
            ucwa.Events.startEvents();

            var data = {
                "duration": 11,
                "uris": sips
            };

            ucwa.Cache.read({
                id: "main"
            }).done(function(cacheData) {
                ucwa.Transport.clientRequest({
                    url: cacheData._embedded.people._links.presenceSubscriptions.href,
                    type: "post",
                    data: data,
                    callback: function(data) {
                        window.site.adHocSubscriptionLink = data.results._links.self.href;
                        $("#extendAdHoc").removeClass("idleAnchor");
                        $("#deleteAdHoc").removeClass("idleAnchor");
                    }
                });
            });
        }
    }

    $("#subscribeAdhoc").click(function() {
        inMemoryPresence = {};
        processAdhoc();

        return false;
    });

    ucwa.Cache.read({
        id: "main"
    }).done(function(cacheData) {
        ucwa.Transport.clientRequest({
            url: cacheData._embedded.people._links.myContacts.href,
            type: "get",
            callback: handleAdHocContacts
        });
    });
}());