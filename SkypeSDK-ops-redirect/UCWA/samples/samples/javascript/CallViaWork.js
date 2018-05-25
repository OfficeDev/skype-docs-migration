/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    // Let people know that a PSTN gateway is required
    alert("A valid PSTN gateway is required to test this feature!");

    var ucwa = window.site.ucwa,

    // Change this to call different users...
    userToCall = "sip:CallViaWorkBot@gotuc.net",

    // This is a mask to check for tel:+1/+1 (0..1) followed by 10 digits
    phoneNumberRegex = /^(\+1|tel:\+1)?\d{10}$/;

    $("#call").click(function() {
        var phoneNumber = $("#phoneNumber").val();

        if (phoneNumber !== "" && phoneNumber.match(phoneNumberRegex)) {
            ucwa.Cache.read({
                id: "main"
            }).done(function(cacheData) {
                ucwa.Transport.clientRequest({
                    url: cacheData._embedded.communication._links.startPhoneAudio.href,
                    type: "post",
                    data: {
                        to: userToCall,
                        phoneNumber: phoneNumber,
                        operationId: ucwa.GeneralHelper.generateUUID()
                    },
                    callback: function(data) {
                        if (data.status !== 201) {
                            alert("Call Via Work Error!");
                        }
                    }
                });
            });
        }

        return false;
    });
}());