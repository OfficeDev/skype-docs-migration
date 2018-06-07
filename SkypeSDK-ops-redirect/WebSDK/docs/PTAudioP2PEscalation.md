
# P2P Escalation

 _**Applies to:** Skype for Business 2015_

[!INCLUDE[ChromeWarning](includes/P2PChromeWarning.md)]


## Escalating a P2P Call to a Group Call

To start off we need to start a P2P Outgoing call, as shown in the **Outgoing P2P** sample.
Once the call is established, we can add a participant to the conversation which escalates the P2P call to a group call.

In the case of a peer-to-peer, P2P, conversation the server will escalate it to a conference.

```js
conversation.participants.add('sip:xxx').then(function() {
    // participant added
}, function (error) {
    // error
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
Here is the complete code sample:

```js
var conversation = application.conversationsManager.getConversation('sip:xxx');
conversation.selfParticipant.audio.state.when('Connected', function () {
    console.log('Connected to audio call');
});
conversation.state.changed(function (newValue, reason, oldValue) {
    console.log('Conversation state changed from', oldValue, 'to', newValue);

    if (newValue === 'Connected') {
        // once the P2P conversation was established, we can add another participant
        // to escalate to a group call
       conversation.participants.add('sip:yyy').then(function() {
            // participant added
        }, function (error) {
            // error
        });
    }
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
