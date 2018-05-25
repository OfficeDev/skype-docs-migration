/* Copyright (C) Microsoft 2014. All rights reserved. */
Transport.clientRequest({
    url: "https://www.example.com/ucwa/mylink",
    type: "get",
    callback: handleSingleResponse
});

var data = {
    message: "Hello World",
    sender: "me"
};

Transport.clientMessage({
    url: "/ucwa/mylink",
    type: "post",
    data: data,
    acceptType: "application/json",
    contentType: "application/json",
    callback: handleSingleResponse
});

function handleSingleResponse(data) {
    if (data.status === 200 || data.status === 204 || data.statusText === "success") {
        // Probably a good request to handle...
        if (data.results !=== undefined) {
            // JSON data exists...
        }
    }
}