/* Copyright (C) Microsoft 2014. All rights reserved. */
Authentication.setCredentials("username", "password");

Authentication.makeMeAvailable(handleStatus);

Authentication.destroyApplication(handleStatus);

function handleStatus(isAuthenticated, data) {
    if (isAuthenticated && data.statusText === "success") {
        // Application is now online...
    } else if (!isAuthenticated && data.statusText === "success") {
        // Application is now offline or successfully destroyed...
    }
}

if (Authentication.isAuthenticated()) {
    alert("Application is online");
}