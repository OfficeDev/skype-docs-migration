/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    batch = new microsoft.rtc.ucwa.samples.Batch(ucwa.Cache, ucwa.Transport),
    imData = {
        importance: "Normal",
        sessionContext: null,
        subject: "Task Sample",
        telemetryId: null,
        to: null
    },
    messagingLinks = {
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
            $("#incomingContacts").parent().removeClass("controls");
            $("#incomingContacts").parent().html($("<p></p").html("* Add contacts and reload to enable this task").addClass("errorText"));
            $("#startIncoming").addClass("idleAnchor");
        }
    }
    
    function handleContact(data) {
        if (data !== undefined) {
            $("#incomingContacts").append($("<option></option>", { value: data.uri }).text(data.name));
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

    function handleInvitation(data, resources) {
        if (contactObjs.length !== 0) {
            // Need to exit to avoid displaying popup twice in case of onlineMeetingInvitation
            return;
        }

        if (data._embedded.messagingInvitation) {
            data = data._embedded.messagingInvitation;
        } else if (data._embedded.onlineMeetingInvitation) {
            data = data._embedded.onlineMeetingInvitation;
        }

        var popup = $("#invitation-template").tmpl({
            image: data._embedded.from._links.contactPhoto !== undefined ? ucwa.Transport.getDomain() + data._embedded.from._links.contactPhoto.href : null,
            name: data._embedded.from.name,
            message: data._links.message && data._links.message.href ? decodeMessage(data._links.message.href) : null
        });

        contactObjs.push({
            name: data._embedded.from.name,
            href: data._embedded.from._links.contact.href
        });

        popup.dialog({
            height: 275,
            width: 350,
            modal: true,
            resizeable: false,
            buttons: {
                "Answer": function() {
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

                    ucwa.Transport.clientRequest({
                        url: data._links.accept.href + "?sessionContext=" + ucwa.GeneralHelper.generateUUID(),
                        type: "post",
                        callback: function(data) {
                            if (data.status !== 204) {
                                cleanupMessaging();
                            }
                        }
                    });
                    $(this).dialog("close");
                },
                "Decline": function() {
                    ucwa.Transport.clientRequest({
                        url: data._links.decline.href + "?sessionContext=" + ucwa.GeneralHelper.generateUUID(),
                        type: "post",
                        data: {
                            'reason' : 'Local'
                        }
                    });
                    $(this).dialog("close");

                    cleanupMessaging();
                }
            }
        });
    }

    function handleMessage(data, parts) {
        if (data._embedded && data.link && data.link.rel) {
            var embedded = data._embedded[data.link.rel] || false;
            if (embedded && embedded._links && embedded._links.plainMessage && embedded._links.plainMessage.href) {
                var message = decodeMessage(embedded._links.plainMessage.href),
                timeStamp = embedded.timeStamp ? embedded.timeStamp : null;

                if (timeStamp) {
                    timeStamp = new Date(parseInt(data._embedded.message.timeStamp.substring(6), 10));
                }

                var contact = null;

                for (var i = 0; i < contactObjs.length; i++) {
                    if (contactObjs[i].href === embedded._links.contact.href) {
                        contact = contactObjs[i];
                        break;
                    }
                }

                if (contact) {
                    $("#imIncoming").append($("#message-template").tmpl({
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

                            $("#imIncoming").append($("#message-template").tmpl({
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
            $("#startIncoming").addClass("idleAnchor");
            $("#stopIncoming").removeClass("idleAnchor");
            $("#sendIncoming").removeClass("idleAnchor");

            if (!messagingLinks.AddParticipant) {
                ucwa.Transport.clientRequest({
                    url: data._embedded.messaging._links.conversation.href,
                    type: "get",
                    callback: function(data) {
                        messagingLinks.AddParticipant = data.results._links.addParticipant.href;
                        $("#addIncoming").removeClass("idleAnchor");
                    }
                });
            }
        } else if (data._embedded.messaging.state === "Disconnected") {
            ucwa.Transport.clientRequest({
                url: data._embedded.messaging._links.addMessaging.href,
                type: "post",
                data: {
                    operationId: ucwa.GeneralHelper.generateUUID()
                },
                callback: function() {
                    if (!messagingLinks.SendMessage) {
                        ucwa.Transport.clientRequest({
                            url: data._embedded.messaging._links.conversation.href,
                            type: "get",
                            callback: function(data) {
                                messagingLinks.SendMessage = data._embedded.messaging._links.sendMessage.href;
                                messagingLinks.StopMessaging = data._embedded.messaging._links.stopMessaging.href;
                                messagingLinks.AddParticipant = data.results._links.addParticipant.href;
                                $("#startIncoming").addClass("idleAnchor");
                                $("#stopIncoming").removeClass("idleAnchor");
                                $("#sendIncoming").removeClass("idleAnchor");
                                $("#addIncoming").removeClass("idleAnchor");
                            }
                        });
                    }
                }
            });
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
        $("#startIncoming").removeClass("idleAnchor");
        $("#stopIncoming").addClass("idleAnchor");
        $("#sendIncoming").addClass("idleAnchor");
        $("#addIncoming").addClass("idleAnchor");

        contactObjs.length = 0;

        for (var id in handlers) {
            ucwa.Events.removeEventHandlers(handlers[id]);
        }

        handlers.length = 0;

        for (var item in messagingLinks) {
            messagingLinks[item] = null;
        }

        $("#imIncoming").append($("#message-template").tmpl({
            name: "",
            timeStamp: formatTime(new Date(Date.now())),
            message: "Conversation has ended."
        }));
    }

    $("#startIncoming").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            $("#imIncoming").html("");

            if (handlers.indexOf("messagingInvitation") === -1) {
                handlers.push("messagingInvitation");
                ucwa.Events.addEventHandlers({
                    rel: "messagingInvitation"
                },
                {
                    started: handleInvitation
                });
            }

            if (handlers.indexOf("onlineMeetingInvitation") === -1) {
                handlers.push("onlineMeetingInvitation");
                ucwa.Events.addEventHandlers({
                    rel: "onlineMeetingInvitation"
                },
                {
                    started: handleInvitation
                });
            }

            if (handlers.indexOf("conversation") === -1) {
                handlers.push("conversation");
                ucwa.Events.addEventHandlers({
                    rel: "conversation"
                },
                {
                    updated: handleConversation
                });
            }

            ucwa.Events.startEvents();
        }

        $("#startIncoming").addClass("idleAnchor");
        $("#stopIncoming").removeClass("idleAnchor");

        return false;
    });

    $("#stopIncoming").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            if (messagingLinks.StopMessaging) {
                ucwa.Transport.clientRequest({
                    url: messagingLinks.StopMessaging,
                    type: "post",
                    callback: handleMessagingStop
                });
            } else {
                $("#imIncoming").html("");
                cleanupMessaging();
                $("#startIncoming").removeClass("idleAnchor");
                $("#stopIncoming").addClass("idleAnchor");
            }
        }

        return false;
    });

    $("#sendIncoming").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            var message = $("#imMessageIncoming").val();

            if (message !== "") {
                ucwa.Transport.clientRequest({
                    url: messagingLinks.SendMessage + "?operationContext=" + ucwa.GeneralHelper.generateUUID(),
                    type: "post",
                    data: message,
                    contentType: "text/plain",
                    callback: function(data) {
                        $("#imMessageIncoming").val("");
                        $("#imIncoming").append($("#message-template").tmpl({
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

    $("#addIncoming").click(function() {
        if (!$(this).hasClass("idleAnchor") && $("#incomingContacts option:selected").length === 1) {
            imData.sessionContext = ucwa.GeneralHelper.generateUUID();
            imData.to = $("#incomingContacts option:selected")[0].value;

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