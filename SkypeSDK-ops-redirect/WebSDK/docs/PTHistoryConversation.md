# Conversations history/logs in the SDK

## Enable getting conversation history

It can be enabled with the `convLogSettings` param in the ctor:

```js
Skype.initialize(config).then(api => {
    var app = new api.application({
        settings: {
            convLogSettings: true
        }
    });
});
```

Once this is done, the SDK will be synchronizing the local list of conversations and messages with what UCWA has in the conversation logs.

## How to invoke the API, what it does and how it works

The logs can be synchronized on demand with the async `getMoreConversations` method:

```js
app.conversationsManager.getMoreConversations().then(() => {
    console.log('done');
});
```

It's safe to invoke this method multiple times: calls to it are debounced internally. Once this method is invoked, the SDK will be synchronizing the list of conversations whenever a new conversation is archived: UCWA notifies the SDK about this with a `missedItems updated` event.

This method does a few things:

1. Gets the list of archived conversations (aka conversation logs): UCWA gives a list with 100 URLs.
2. Picks the top 20 URLs: this works because most recent entries are at the top of the list.
3. Discards those URLs that have been loaded by previous calls to the method.
4. Sends a GET to each of the URL to get metadata of the archived conversations.
5. Picks only p2p conversations with messages. Other types: conferences, video calls and so on are discarded.
6. Creates local p2p conversation objects, if necessary. Multiple conv logs can map to one conversation.

Thanks to batching, the SDK needs to send only 2 requests:

- a GET to get the list of conversation logs URLs
- a POST that sends a batch of up to 20 GETs to get the metadata

This method does not pull messages from the conv logs and to get messages use `getMoreActivityItems`:

```js
conversation.historyService.getMoreActivityItems().then(() => {
    console.log('done');
});
```

> Note, that downloading messages with `getMoreActivityItems` is a very expensive operation and should be done only when the corresponding conversation is visible in the UI.

This method does a few things:

1. Sends a GET to each conv log associated with the conversation to get the list of messages.
2. Picks first 20 messages from each conv log.
3. Adds message objects to the conversation. Messages are sorted by timestamp, so messages from the archive will appear before the messages sent recently.

Thanks to batching, the SDK needs only one request even if messages for multiple conversations are pulled:

- a POST that sends a batch of up to 20 GETs to get messages

## What should a UI team do to display history items

Messages from the archive appear in the SDK just like all other messages sent or received by the user, so if there is a UI that can render all that, it can also render the archived messages. A message from the archive will have text/html content, timestamp and id of the person who sent it:

```js
// this collection has messages only: no AV call records, etc.
var messages = conv.historyService.activityItems
    .filter(item => item.type() == "TextMessage");

messages.added(message => {
    message.direction();
    message.timestamp();
    message.text();
    message.html();
    message.sender.id(); // SIP URI

    // fetch the display name from UCWA
    message.sender.displayName.get().then(name => {
        console.log(name);
    });

    // fetch the contact photo
    message.sender.avatarUrl.get().then(url => {
        console.log(url);
    });

    // subscribe to the sender's presence status
    message.sender.availability.subscribe();
    message.sender.availability.changed(status => {
        console.log(status);
    });
});
```

## How to identify active conversations vs. history fetched

There is no special indicator for that. It's possible to check the conversation state, but if a conversation is disconnected, this does not necessarily mean that it is from the archive. 

## How to restart an archived conversation

It can be started/restarted just like any other conversation: by sending a message, starting the chat service, starting an AV call and so on. The easiest way is probably to just send a message:

```js
// if it's already started, this will just send the message;
// otherwise it'll tell UCWA to create a conversation and
// then will send the message
conv.chatService.sendMessage("Hi");
``` 

## How to force refetch history items

With the `getMoreConversations` method. However this shouldn't be needed: UCWA sends `missedItems updated` events when new items appear in the archive.

## Sample

```js
var conversationsManager = application.conversationsManager;
conversationsManager.getMoreConversations().then(function () {
    // console.log('done')
});
conversations = {};
listeners.push(conversationsManager.conversations.added(function (conv) {
    // successfully fetched conversation
    conversations[convId] = conv;
    // add button under each conversation to fetch history
    // on button click
    {
        conversations[convId].historyService.getMoreActivityItems();
    }
    listeners.push(conv.historyService.activityItems
        .filter(function (item) { return item.type() === "TextMessage"; })
        .added(function (msg) {
            // getMoreActivityItems triggers this
            // access different properties on msg like msg.sender.id(), msg.text() etc...
    }));
}));
```
