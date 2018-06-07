
# Phone Audio Call

 _**Applies to:** Skype for Business 2015_
 
 _**Prerequisites:** To use Phone Audio, user needs a valid Office 365 Enterprise E5 license with PSTN calling set up_

> [!IMPORTANT]
> This feature is not supported in **Google Chrome**.

## Starting a Phone Audio Call

In order to make a phone audio call we need to:
1. create a conversation
```js
var conversation = application.conversationsManager.getConversation('sip:XXXX');
```
2. start the audio call with the user, specifying the phone # where we want to connect the phone audio from
```js
conversation.phoneAudioService.start({ teluri: 'tel:+1XXXX' });
```

## Conversation Call State
We can subscribe to the conversation call state to get information about the overall call status.
For example: Is there an ongoing call in this conversation. This does not mean that we are connected to the call.

```js
conversation.state.changed(function (newValue, reason, oldValue) {
    //...
});
```

**Possible call states:**

|||
|--------------|------------------------------------------|
| *Created* | ...When conversation was created
| *Connecting*    | ...When establishing a connection           |
| *Connected* | ...When the call was successfully connected |
| *Disconnected* | ...When the conversation got disconnected |

## Self Participant Call state
The `state` property on the `phoneAudioService` allows us to observe the call state.
For example: if the state changes to `"Connected"` it means we have successfully connected to the phone audio call.

```js
conversation.phoneAudioService.state.when('Connected', function () {
    //...
});
```

**Note:** `.when(value, callback)` Lets you subscribe to an observable and only triggers the callback when the observable changes its value to the value specified.
For Example: `state.when('Connected', callback)` will execute the `callback` when the value of state changes to "Connected".

## Participants in Conversation
You can subscribe to the `participants` collection on the `conversation` object to be notified when new perticipants enter the conversation.

```js
conversation.participants.added(function (participant) {
    // ...
});
```

## Ending a Call
To end the call, simply leave the conversation

```js
conversation.leave().then(function () {
    // successfully left the conversation
}, function (error) {
    // error
});
```

## Complete Code Sample
Here is the code combined:

```js
var conversation = application.conversationsManager.getConversation('sip:XXXX');
conversation.phoneAudioService.state.when('Connected', function () {
    // connected to phone audio
});
conversation.state.changed(function (newValue, reason, oldValue) {
    // Conversation state changed from oldValue to newValue
});
conversation.participants.added(function (participant) {
    // participant.displayName() has been added to the conversation
});
conversation.phoneAudioService.start({teluri: 'tel:+1XXXX'}).then(function() {
    // successfully started call
}, function (error) {
    // handle error
});
```
