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

    function handleGroups(data) {
        var groups = $("#groups");

        for (var groupType in data.results._embedded) {
            var currentGroupType = data.results._embedded[groupType];

            if (currentGroupType.length) {
                for (var group in currentGroupType) {
                    groups.append($("<option></option>", { value: currentGroupType[group]._links.self.href}).text(currentGroupType[group].name));
                }
            } else {
                groups.append($("<option></option>", { value: currentGroupType._links.self.href}).text(currentGroupType.name));
            }
        }
    }

    function handleSubscription(data) {
        window.site.subscribeToGroupPresence = data.results._links.subscribeToGroupPresence.href;
        
        batch.queueRequest({
            url: data.results._links.groupContacts ? data.results._links.groupContacts.href : data.results._links.expandDistributionGroup.href,
            type: "get",
            callback: handleGroupBatch
        });

        batch.queueRequest({
            url: window.site.subscribeToGroupPresence + "&duration=11",
            type: "post",
            callback: function(data) {
                // This is the group subscription link
                window.site.groupPresenceSubscriptionLink = data.results._links.self.href;
            }
        });

        batch.processBatch();
    }

    function handleGroupBatch(data) {
        var requesting = false;

        if (data.results._links && data.results._links.contact) {
            requesting = true;
            if ($.isArray(data.results._links.contact)) {
                for (var item in data.results._links.contact) {
                    batch.queueRequest({
                        url: data.results._links.contact[item].href,
                        type: "get",
                        callback: handleGroupContact
                    });
                }
            } else {
                batch.queueRequest({
                    url: data.results._links.contact.href,
                    type: "get",
                    callback: handleGroupContact
                });
            }
        } else if (data.results._embedded && data.results._embedded.contact) {
            requesting = true;

            if ($.isArray(data.results._embedded.contact)) {
                for (var item in data.results._embedded.contact) {
                    handleGroupContact({results: data.results._embedded.contact[item]});
                }
            } else {
                handleGroupContact({results: data.results._embedded.contact});
            }
        }

        if (requesting) {
            batch.processBatch();

            $("#extendGroup").removeClass("idleAnchor");
            $("#deleteGroup").removeClass("idleAnchor");
        } else {
            window.site.groupPresenceSubscriptionLink = null;
            ucwa.Events.stopEvents();
            alert("No contacts in selected group to subscribe to!");
        }
    }

    function handleGroupContact(data) {
        if (data !== undefined) {
            var moreData = parseSubscriptionContact(data.results);
            moreData.type = "group";

            $("#groupSubscribed").append($("#contact-presence-template").tmpl(moreData));
            $("#group" + moreData.id).css("border-left-color", inMemoryPresence[moreData.id] || presenceColors.Unknown);
        }
    }

    function parseSubscriptionContact(data) {
        var contact = {
            id:  determineContactId(data._links.self.href),
            name: data.name,
        };

        return contact;
    }

    $("#subscribeGroup").click(function() {
        inMemoryPresence = {};
        $("#groupSubscribed").html("");

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
                            element = $("#group" + id),
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

        ucwa.Transport.clientRequest({
            url: $("#groups option:selected").val(),
            type: "get",
            callback: handleSubscription
        });

        return false;
    });

    ucwa.Cache.read({
        id: "main"
    }).done(function(cacheData) {
        ucwa.Transport.clientRequest({
            url: cacheData._embedded.people._links.myGroups.href,
            type: "get",
            callback: handleGroups
        });
    });
}());