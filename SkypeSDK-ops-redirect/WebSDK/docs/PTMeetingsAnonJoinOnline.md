# Joining meetings anonymously in online toplogies

The caller needs to get two things from a UCAP service:

- Discover URL
- Access Token

Then they can be used to get the UCWA pool and a conference URI:

```js
token = 'Bearer psat=<...>';        
discoverUrl = 'https://<...>/platformservice/discover?anonymousMeetingJoinContext=psat%25<...>';

app.signInManager.signIn({
    name: 'Guest224',
    cors: true,
    root: { user: discoverUrl },
    auth(req, send) {
        // the GET /discover must be sent without the token
        if (req.url != discoverUrl)
            req.headers['Authorization'] = token;

        return send(req);
    }
});
```

> The discover GET request must be sent with a token, but other requests should have the token.

The discover response contains the conference URI, so the SDK creates a conversation object that can be then used to join the meeting:

```js
app.signInManager.signIn(...).then(() => {
    var conv = app.conversationsManager.conversations(0);

    console.log(conv.uri()); // the conference URI

    conv.chatService.start().then(() => {
        // you're in the conference now
        conv.chatService.sendMessage("Hi there");
    });
});
```
