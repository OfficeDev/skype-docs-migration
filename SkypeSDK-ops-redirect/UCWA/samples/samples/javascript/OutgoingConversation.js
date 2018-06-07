/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    batch = new microsoft.rtc.ucwa.samples.Batch(ucwa.Cache, ucwa.Transport),
    opRes = new microsoft.rtc.ucwa.samples.OperationResource(ucwa.Transport, ucwa.Events),
    imData = {
        importance: "Normal",
        sessionContext: null,
        operationId: null,
        subject: "Task Sample",
        telemetryId: null,
        to: null
    },
    messagingLinks = {
        Messaging: null,
        SendMessage: null,
        StopMessaging: null,
        AddParticipant: null
    },
    selfName = "",
    contactObjs = [],
    handlers = [];

    function handleContacts(data) {
        if (data && data.results && data.results._embedded && data.results._embedded.contact && !ucwa.GeneralHelper.isEmpty(data.results._embedded.contact)) {
            var contacts = data.results._embedded.contact;

            if ($.isArray(contacts)) {
                for (var contact in contacts) {
                    handleContact(contacts[contact]);
                }
            } else {
                 handleContact(contacts);
            }

            batch.processBatch();
        } else {
            $("#outgoingContacts").parent().removeClass("controls");
            $("#outgoingContacts").parent().html($("<p></p>").html("* Add contacts and reload to enable this task").addClass("errorText"));
        }
    }

    function handleContact(data) {
        if (data !== undefined) {
            $("#outgoingContacts").append($("<option></option>", { value: data.uri }).text(data.name));
            $("#startOutgoing").removeClass("idleAnchor");
        }
    }

    function decodeMessage(message) {
        return ucwa.GeneralHelper.extractDataFromDataUri(message, { unescape: true });
    }

    function formatTime(time) {
        var formatted = time.getHours() % 12 + ":";
        formatted += (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + ":";
        formatted += time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
        formatted += time.getHours() < 12 ? " AM" : " PM";

        return formatted;
    }

    function handleMessage(data, parts) {
        if (data._embedded && data.link && data.link.rel) {
            var embedded = data._embedded[data.link.rel] || false;

            if (embedded && embedded._links && embedded._links.plainMessage && embedded._links.plainMessage.href) {
                var message = decodeMessage(embedded._links.plainMessage.href),
                timeStamp = embedded.timeStamp ? embedded.timeStamp : null;

                if (timeStamp) {
                    timeStamp = new Date(parseInt(data._embedded.message.timeStamp.substring(6)));
                }

                var contact = null;

                for (var i = 0; i < contactObjs.length; i++) {
                    if (contactObjs[i].href === embedded._links.contact.href) {
                        contact = contactObjs[i];
                        break;
                    }
                }

                if (contact) {
                    $("#imOutgoing").append($("#message-template").tmpl({
                        name: contact.name,
                        timeStamp: formatTime(timeStamp),
                        message: message
                    }));
                } else {
                    ucwa.Transport.clientRequest({
                        url: embedded._links.contact.href,
                        type: "get",
                        callback: function(data) {
                            contactObjs.push({
                                name: data.results.name,
                                href: embedded._links.contact.href
                            });

                            $("#imOutgoing").append($("#message-template").tmpl({
                                name: data.results.name,
                                timeStamp: formatTime(timeStamp),
                                message: message
                            }));
                        }
                    });
                }
            }
        }
    }

    function handleMessaging(data) {
        if (data._embedded.messaging.state === "Connected") {
            messagingLinks.SendMessage = data._embedded.messaging._links.sendMessage.href;
            messagingLinks.StopMessaging = data._embedded.messaging._links.stopMessaging.href;
            $("#startOutgoing").addClass("idleAnchor");
            $("#stopOutgoing").removeClass("idleAnchor");
            $("#sendOutgoing").removeClass("idleAnchor");

            if (!messagingLinks.AddParticipant) {
                ucwa.Transport.clientRequest({
                    url: data._embedded.messaging._links.conversation.href,
                    type: "get",
                    callback: function(data) {
                        messagingLinks.AddParticipant = data.results._links.addParticipant.href;
                        $("#addOutgoing").removeClass("idleAnchor");
                    }
                });
            }
        }
    }

    function handleConversation(data) {
        if (data._embedded.conversation.state === "Disconnected") {
            cleanupMessaging();
        }
    }

    function handleMessagingStop(data) {
        if (data.status === 204 || data.status === 404) {
            cleanupMessaging();
        }
    }

    function cleanupMessaging() {
        $("#startOutgoing").removeClass("idleAnchor");
        $("#stopOutgoing").addClass("idleAnchor");
        $("#sendOutgoing").addClass("idleAnchor");
        $("#addOutgoing").addClass("idleAnchor");

        contactObjs.length = 0;

        for (var id in handlers) {
            ucwa.Events.removeEventHandlers(handlers[id]);
        }

        handlers.length = 0;

        for (var item in messagingLinks) {
            messagingLinks[item] = null;
        }

        $("#imOutgoing").append($("#message-template").tmpl({
            name: "",
            timeStamp: formatTime(new Date(Date.now())),
            message: "Conversation has ended."
        }));
    }

    $("#startOutgoing").click(function() {
        if (!$(this).hasClass("idleAnchor") && $("#outgoingContacts option:selected").length === 1) {
            ucwa.Cache.read({
                id: "main"
            }).done(function(cacheData) {
                $("#imOutgoing").html("");
                imData.sessionContext = ucwa.GeneralHelper.generateUUID();
                imData.operationId = ucwa.GeneralHelper.generateUUID();
                imData.to = $("#outgoingContacts option:selected")[0].value;
                ucwa.Transport.clientRequest({
                    url: cacheData._embedded.communication._links.startMessaging.href,
                    type: "post",
                    data: imData,
                    callback: function(data) {
                        if (data.status === 201) {
                            if (handlers.indexOf("conversation") === -1) {
                                handlers.push("conversation");
                                ucwa.Events.addEventHandlers({
                                    rel: "conversation"
                                },
                                {
                                    updated: handleConversation
                                });
                            }

                            if (handlers.indexOf("message") === -1) {
                                handlers.push("message");
                                ucwa.Events.addEventHandlers({
                                    rel: 'message'
                                },
                                {
                                    completed: handleMessage
                                });
                            }

                            if (handlers.indexOf("messaging") === -1) {
                                handlers.push("messaging");
                                ucwa.Events.addEventHandlers({
                                    rel: "messaging"
                                },
                                {
                                    updated: handleMessaging
                                });
                            }

                            ucwa.Events.startEvents();
                        } else {
                            cleanupMessaging();
                        }
                    }
                });
            });
        }

        return false;
    });

    $("#stopOutgoing").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            ucwa.Transport.clientRequest({
                url: messagingLinks.StopMessaging,
                type: "post",
                callback: handleMessagingStop
            });
        }

        return false;
    });

    $("#sendOutgoing").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            var message = $("#imMessageOutgoing").val();

            if (message !== "") {
                ucwa.Transport.clientRequest({
                    url: messagingLinks.SendMessage + "?OperationContext=" + ucwa.GeneralHelper.generateUUID(),
                    type: "post",
                    data: message,
                    contentType: "text/plain",
                    callback: function(data) {
                        $("#imMessageOutgoing").val("");
                        $("#imOutgoing").append($("#message-template").tmpl({
                            name: selfName,
                            timeStamp: formatTime(new Date(Date.now())),
                            message: message
                        }));
                    }
                });
            }
        }

        return false;
    });

    $("#addOutgoing").click(function() {
        if (!$(this).hasClass("idleAnchor") && $("#outgoingContacts option:selected").length === 1) {
            imData.sessionContext = ucwa.GeneralHelper.generateUUID();
            imData.to = $("#outgoingContacts option:selected")[0].value;

            ucwa.Transport.clientRequest({
                url: messagingLinks.AddParticipant,
                type: "post",
                data: imData
            });
        }

        return false;
    });

    ucwa.Cache.read({
        id: "main"
    }).done(function(cacheData) {
        batch.queueRequest({
            url: cacheData._embedded.people._links.myContacts.href,
            type: "get",
            callback: handleContacts
        });

        batch.queueRequest({
            url: cacheData._embedded.me._links.self.href,
            type: "get",
            callback: function(data) {
                selfName = data.results.name;
            }
        });

        batch.processBatch();
    });
}());