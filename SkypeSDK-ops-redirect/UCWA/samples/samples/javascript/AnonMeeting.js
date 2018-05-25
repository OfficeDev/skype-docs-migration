/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    onlineMeetingUri = "",
    displayName = "",
    messagingLinks = {
        SendMessage: null,
        StopMessaging: null,
        AddParticipant: null
    },
    contactObjs = [],
    handlers = [];

    function handleAjaxStart() {
        $("body").addClass("loading");
    }

    function handleAjaxStop() {
        $("body").removeClass("loading");
    }

    function handleAuthenticated() {
        handlers.push("message");
        ucwa.Events.addEventHandlers({
            rel: "message"
        },
        {
            completed: handleMessage
        });

        handlers.push("messaging");
        ucwa.Events.addEventHandlers({
            rel: "messaging"
        },
        {
            updated: handleMessaging
        });

        handlers.push("participant");
        ucwa.Events.addEventHandlers({
            rel: "participant"
        },
        {
            started: handleStartedParticipants,
            completed: handleCompletedParticipants
        });

        ucwa.Events.startEvents();

        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            ucwa.Transport.clientRequest({
                url: cacheData._embedded.communication._links.joinOnlineMeeting.href,
                type: "post",
                data: {
                    anonymousDisplayName: displayName,
                    onlineMeetingUri: onlineMeetingUri,
                    operationId: ucwa.GeneralHelper.generateUUID()
                },
                callback: function(data) {
                    if (data.status === 201) {
                        $("#meetingMessages").append($("#message-template").tmpl({
                            name: "",
                            timeStamp: formatTime(new Date(Date.now())),
                            message: "Joined Meeting as: " + displayName
                        }));
                    }
                }
            });
        });
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

    function getContact(href) {
        var contact = null;

        for (var i = 0; i < contactObjs.length; i++) {
            if (contactObjs[i].href === href) {
                contact = contactObjs[i];
                break;
            }
        }

        return contact;
    }

    function cleanupMeeting() {
        $("#joinMeeting").removeClass("idleAnchor");
        $("#sendMessage").addClass("idleAnchor");
        $("#leaveMeeting").addClass("idleAnchor");

        for (var item in messagingLinks) {
            messagingLinks[item] = null;
        }

        contactObjs.length = 0;

        for (var id in handlers) {
            ucwa.Events.removeEventHandlers(handlers[id]);
        }

        handlers.length = 0;

        $("#meetingMessages").append($("#message-template").tmpl({
            name: "",
            timeStamp: formatTime(new Date(Date.now())),
            message: "Meeting has ended."
        }));

        ucwa = new microsoft.rtc.ucwa.samples.Main(true);
    }

    function handleMessage(data, parts) {
        if (data._embedded.message._links.plainMessage) {
            var message = decodeMessage(data._embedded.message._links.plainMessage.href),
            timeStamp = data._embedded.message.timeStamp ? data._embedded.message.timeStamp : null;

            if (timeStamp) {
                timeStamp = new Date(parseInt(timeStamp.substring(6), 10));
            }

            var contact = getContact(data._embedded.message._links.participant.href);

            if (contact) {
                $("#meetingMessages").append($("#message-template").tmpl({
                    name: contact.name,
                    timeStamp: formatTime(timeStamp),
                    message: message
                }));
            } else {
                ucwa.Transport.clientRequest({
                    url: data._embedded.message._links.participant.href,
                    type: "get",
                    callback: function(data) {
                        contactObjs.push({
                            name: data.results.name,
                            href: data._embedded.message._links.participant.href
                        });

                        $("#meetingMessages").append($("#message-template").tmpl({
                            name: data.results.name,
                            timeStamp: formatTime(timeStamp),
                            message: message
                        }));
                    }
                });
            }
        }
    }

    function handleMessaging(data) {
        if (data._embedded.messaging.state === "Connected") {
            messagingLinks.SendMessage = data._embedded.messaging._links.sendMessage.href;
            messagingLinks.StopMessaging = data._embedded.messaging._links.stopMessaging.href;
            $("#joinMeeting").addClass("idleAnchor");
            $("#sendMessage").removeClass("idleAnchor");
            $("#leaveMeeting").removeClass("idleAnchor");

            // Decided if we really need to add participants...?
            // if (!messagingLinks.AddParticipant) {
            //     ucwa.Transport.clientRequest({
            //         url: data._embedded.messaging._links.conversation.href,
            //         type: "get",
            //         callback: function(data) {
            //             messagingLinks.AddParticipant = data.results._links.addParticipant.href;
            //             $("#addIncoming").removeClass("idleAnchor");
            //         }
            //     });
            // }
        } else if (data._embedded.messaging.state === "Disconnected") {
            ucwa.Transport.clientRequest({
                url: data._embedded.messaging._links.addMessaging.href,
                type: "post",
                data: {
                    operationId: ucwa.GeneralHelper.generateUUID()
                },
                callback: function(data) {
                    if (data.status !== 201) {
                        cleanupMeeting();
                    }
                }
            });
        }
    }

    function handleStartedParticipants(data) {
        if (!data["in"]) {
            var contact = getContact(data.link.href)

            if (!contact) {
                contactObjs.push({
                    name: data.link.title,
                    href: data.link.href
                });
            }
        } else {
            // handle typing and others here...
        }
    }

    function handleCompletedParticipants(data) {
        // remove participants here...
        if (!data["in"]) {
            var contact = getContact(data.link.href);

            if (contact) {
                var index = contactObjs.indexOf(contact);
                contactObjs.splice(index, 1);
            }
        } else {
            // handle typing and others here...
        }
    }

    $("#joinMeeting").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            var domain = "";

            onlineMeetingUri = $("#onlineMeetingUri").val().trim();
            displayName = $("#displayName").val();

            if (displayName !== "" && onlineMeetingUri !== "") {
                $("#meetingMessages").html("");
                var temp = onlineMeetingUri.split("@");

                if (temp.length >= 2) {
                    temp = temp[1];

                    domain = temp.split(";")[0];
                }

                ucwa.Transport.setRequestCallbacks({
                    start: handleAjaxStart,
                    stop: handleAjaxStop
                });
                handleAjaxStart();
                ucwa.AutoDiscovery.startDiscovery(domain, $("#anonContainer"), function(link) {
                    ucwa.Authentication.setAnonymousJoinUri(onlineMeetingUri)
                    ucwa.Authentication.start(link, {
                        userAgent: "UCWA Samples - Anon Meeting",
                        endpointId: ucwa.GeneralHelper.generateUUID(),
                        culture: "en-US"
                    }, function(isAuthenticated) {
                        handleAjaxStop();

                        if (isAuthenticated) {
                            handleAuthenticated();
                        } else {
                            alert("Unable to join meeting anonymously!");
                        }
                    });
                });
            } else {
                alert("Online Meeting Uri is required along with Display Name");
            }
        }

        return false;
    });

    $("#sendMessage").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            var message = $("#message").val();

            if (message.length !== 0) {
                ucwa.Transport.clientRequest({
                    url: messagingLinks.SendMessage + "?SessionContext=" + ucwa.GeneralHelper.generateUUID(),
                    type: "post",
                    contentType: "text/plain",
                    data: message,
                    callback: function() {
                        $("#message").val("");
                        $("#meetingMessages").append($("#message-template").tmpl({
                            name: displayName,
                            timeStamp: formatTime(new Date(Date.now())),
                            message: message
                        }));
                    }
                });
            }
        }

        return false;
    });

    $("#leaveMeeting").click(function() {
        if (!$(this).hasClass("idleAnchor")) {
            ucwa.Cache.read({
                id: "main"
            }).done(function(cacheData) {
                ucwa.Transport.clientRequest({
                    url: cacheData._links.self.href,
                    type: "delete",
                    callback: function() {
                        cleanupMeeting();
                    }
                });
            });
        }

        return false;
    });
}());