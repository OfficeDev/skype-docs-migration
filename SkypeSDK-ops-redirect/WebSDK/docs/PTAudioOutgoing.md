
# Outgoing P2P/PSTN Call

 _**Applies to:** Skype for Business 2015_

[!INCLUDE[ChromeWarning](includes/P2PChromeWarning.md)]

## Starting a Call

In order to make an audio call we need to:

1. create a conversation

    ```js
    var conversation = application.conversationsManager.getConversation('sip:XXXX');
    // or
    var conversation = application.conversationsManager.getConversation('tel:+XXXX');
    ```

2. start the audio modality in the conversation

    ```js
    conversation.audioService.start();
    ```

## Conversation State
We can subscribe to the conversation state to get information about the overall state of the conversation.
If a conversation's state is `Connected`, it means that we are receiving live updates about state changes within the
conversation, and will receive updates when the state of any active modality in the conversation changes, or
when other participants connected to the conversation attempt to add or remove modalities. The conversation state
being `Connected` does not mean that any particular modality is active.

```js
conversation.state.changed(function (newValue, reason, oldValue) {
    //...
});
```

**Possible Conversation States:**

|||
|--------------|------------------------------------------|
| *Created* | ...When conversation was created
| *Connecting*    | ...When establishing a connection           |
| *Connected* | ...When the call was successfully connected |
| *Disconnected* | ...When the conversation got disconnected |

## Audio Modality State
The `conversation.selfParticipant.audio` property represents audio modality in the conversation. 
This allows us to observe changes in the audio modality `state` as a participant in the conversation.
For example: if the state changes to `"Connected"` it means the audio modality has been successfully connected
in the conversation.

```js
conversation.selfParticipant.audio.state.when('Connected', function () {
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

## Ending an Audio Call

There are 2 ways to end an audio call: either stop the audio modality by calling `conversation.audioService.stop()`
or leave the conversation entirely by calling `conversation.leave()`. If a modality other than audio, such
as chat, is active in the conversation, calling `conversation.leave()` will disconnect that as well and
cause the `conversation.state()` to become `Disconnected`. If you want to hang up audio in a call but remain
connected to the conversation by chat, call `conversation.audioService.stop()`.

```js
conversation.leave().then(function () {
    // successfully left the conversation
}, function (error) {
    // error
});

// OR

conversation.audioService.stop().then(function () {
    // successfully stopped audio
}, function (error) {
    console.log("Failed to stop audio: " + error);
});
```

## Complete Code Sample
Here is the code combined:

```js
var conversation = application.conversationsManager.getConversation('sip:XXXX');
OR
var conversation = application.conversationsManager.getConversation('tel:+XXXX');
conversation.selfParticipant.audio.state.when('Connected', function () {
    console.log('Connected to audio call');
});
conversation.state.changed(function (newValue, reason, oldValue) {
    console.log('Conversation state changed from', oldValue, 'to', newValue);
});
conversation.participants.added(function (participant) {
    console.log('Participant:', participant.displayName(), 'has been added to the conversation');
});
conversation.audioService.start().then(function() {
    console.log('The call has been started successfully');
}, function (error) {
    console.log('An error occured starting the call', error);
});
```
