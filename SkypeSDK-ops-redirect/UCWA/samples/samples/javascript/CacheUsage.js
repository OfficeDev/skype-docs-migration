/* Copyright (C) Microsoft 2014. All rights reserved. */
var Cache = new microsoft.rtc.ucwa.samples.Cache(),
data = {
    rel : "me",
    name : "John Doe",
    _links: {
        self: {
            href: "/me"
        }
    },
    _embedded: {
        presence: {
            _links: {
                self {
                    href: "/me/presence"
                }
            }
        }
    }
};

Cache.init();
Cache.create({
    id: "main",
    data: data,
    callback: function(id) {
        if (id === "main") {
            alert("Created data for id: " + id);
        }
    }
});

Cache.read({
    id: "main"
}).done(function(data) {
    alert("Read data: " + data);

    var href = data._embedded.presence._links.self.href;
});

Cache.update({
    id: "main",
    data: {}
}).done(function() {
    if (id === "main") {
        alert("Updated data for id: " + id);
    }
});

Cache.delete({
    id: "main",
    callback: function(id) {
        if (id === "main") {
            alert("Deleted data for id: " + id);
        }
    }
});