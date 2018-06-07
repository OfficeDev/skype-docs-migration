/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var ucwa = window.site.ucwa,
    batch = new microsoft.rtc.ucwa.samples.Batch(ucwa.Cache, ucwa.Transport);

    function handleMeetingResponseBody(data) {
        window.site.meetingLink = data.results._links.self.href;
        window.site.meetingUrl = data.results.joinUrl;
        window.site.meeting = data.results;
    }

    function handleScheduleMeeting() {
        var selected = $("#contactList option:selected");

        ucwa.Cache.read({
            id: "main"
        }).done(function(cacheData) {
            var leaders = [],
            attendees = [];

            for (var i = 0; i < selected.length; i++) {
                attendees.push(selected[i].value);
            }

            var data = {
                attendanceAnnouncementsStatus: $("#announcementStatus").prop("checked") ? "Enabled" : "Disabled",
                description: $("#description").val(),
                subject: $("#subject").val(),
                attendees: attendees,
                leaders: leaders,
                accessLevel: "Everyone"
            };

            ucwa.Transport.clientRequest({
                url: cacheData._embedded.onlineMeetings._links.myOnlineMeetings.href,
                type: "post",
                data: data,
                callback: function(data) {
                    $("#scheduleMeeting").toggleClass("idleAnchor");
                    $("#joinMeeting").toggleClass("idleAnchor");
                    $("#updateMeeting").toggleClass("idleAnchor");
                    $("#deleteMeeting").toggleClass("idleAnchor");
                    $("#meetingUri").text("onlineMeetingUri: " + data.results.onlineMeetingUri);
                    handleMeetingResponseBody(data);
                }
            });
        });
    }

    function handleContacts(data) {
        if (data && data.results && data.results._embedded && data.results._embedded.contact) {
            var contacts = data.results._embedded.contact;
            if (contacts !== undefined) {
                if ($.isArray(contacts)) {
                    for (var contact in contacts) {
                        handleContact(contacts[contact]);
                    }
                } else {
                    handleContact(contacts);
                }
            }
        } else {
            $("#contactList").parent().removeClass("controls");
            $("#contactList").parent().html($("<p></p").html("* Add contacts and reload to enable this task").addClass("errorText"));
            $("#scheduleMeeting").addClass("idleAnchor");
        }
    }

    function handleContact(data) {
        if (data !== undefined) {
            var contact = parseContact(data);
            $("#contactList").append($("<option></option>", { value: contact.uri }).text(contact.name));
            $("#contactList").show();
        }
    }

    function parseContact(data) {
        var contact = {
            name: data.name,
            uri : data.uri
        };

        return contact;
    }

    $("#scheduleMeeting").click(function() {
        if (!$("#scheduleMeeting").hasClass("idleAnchor")) {
            handleScheduleMeeting();
        }

        return false;
    });

    $("#joinMeeting").click(function() {
        if (window.site.meetingUrl !== undefined && !$("#joinMeeting").hasClass("idleAnchor")) {
            window.open(window.site.meetingUrl);
        }

        return false;

    });

    $("#updateMeeting").click(function () {
        if (window.site.meetingLink !== undefined && !$("#updateMeeting").hasClass("idleAnchor")) {
            var selected = $("#contactList option:selected"),
            leaders = [],
            attendees = [];

            for (var i = 0; i < selected.length; i++) {
                attendees.push(selected[i].value);
            }

            var data = {
                attendanceAnnouncementsStatus: $("#announcementStatus").prop("checked") ? "Enabled" : "Disabled",
                description: $("#description").val(),
                subject: $("#subject").val(),
                attendees: attendees,
                leaders: leaders
            };

            $.extend(window.site.meeting,data);
            if (typeof(window.site.meeting.expirationTime) === "string") {
                window.site.meeting.expirationTime = new Date(parseInt(window.site.meeting.expirationTime.substring(6),10));
            }

            ucwa.Transport.clientRequest({
                url: window.site.meetingLink,
                type: "put",
                data: window.site.meeting,
                callback: function(data) {
                    if (data.status === 200) {
                        $("#updateMeeting").removeClass("idleAnchor");
                        handleMeetingResponseBody(data);
                        alert("Meeting properties successfully changed!");
                    } else if (data.status === 412) {
                        alert("Meeting change failed because someone else updated the meeting.");
                    }
                }
            });
        }

        return false;
    });

    $("#deleteMeeting").click(function() {
        ucwa.Transport.clientRequest({
            url: window.site.meetingLink,
            type: "delete",
            callback: function(data) {
                $("#scheduleMeeting").toggleClass("idleAnchor");
                $("#joinMeeting").toggleClass("idleAnchor");
                $("#updateMeeting").toggleClass("idleAnchor");
                $("#deleteMeeting").toggleClass("idleAnchor");
                $("#meetingUri").text("");
            }
        });
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
                window.site.selfUri = data.results.uri;
            }
        });

        batch.processBatch();
    });

    $("#contactList").hide();
}());