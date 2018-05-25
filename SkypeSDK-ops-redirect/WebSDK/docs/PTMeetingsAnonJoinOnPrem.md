# Joining meetings anonymously in onprem toplogies

The caller needs to know the join URL of the meeting to join:

```js
app.signInManager.signIn({
  join_url: "https://<...>/johndoe/BYGXVLBQ",
  name: "Guest223",
});
```

The SDK sends a lookup request to the join launcher (aka JL) service and gets URL of the meeting organizer's pool as well as the conference URI. After that the SDK joins the conference anonymously and creates a conversation object that can be then used to join the meeting:

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

