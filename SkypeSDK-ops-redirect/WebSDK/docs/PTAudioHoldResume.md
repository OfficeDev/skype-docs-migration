# Hold/Resume a P2P Audio Conversation

_**Applies to:** Skype for Business 2015_

## Starting an audio conversation

For detailed instructions see, <a href="//msdn.microsoft.com/skype/websdk/docs/ptaudiooutgoing" target="">Outgoing P2P Audio</a>

The application object exposes a conversationsManager object which we can use to create new conversations by calling getConversation(...) and providing a SIP URI.

Once you have a conversation, you can start audio by calling `conversation.audioservice.start()`.

```js
    conversation = conversationsManager.getConversation('sip:xxx');
        conversation.selfParticipant.audio.state.when('Connected', function () {
            // Audio service connected
        });
        conversation.participants.added(function (person) {
            // Remote participant joined call
        });
        conversation.state.changed(function (newValue, reason, oldValue) {
            if (newValue === 'Connected') {
                // Conversation connected
            }
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                // Conversation disconnected
            }
        });
        conversation.audioService.start().then(null, function (error) {
            // Error while starting audioService
        });
```


## Hold/Resume within an audio conversation

Putting the call on hold will put the existing audio call into an inactive state while leaving
the actual audio modality connected. No audio will flow in or out, but the audio can be easily
resumed without having to totally restart the modality.

To put a call on hold, simply call `selfParticipant.audio.isOnHold(true)`. Note that the states of the
audioService and the conversation will remain 'Connected.'

Resume the audio call by calling `selfParticipant.audio.isOnHold(false)`. This will put the audio
modality back into an active state.

```js
    function holdResumeCall() {
        var selfParticipant = conversation.selfParticipant;
        var audio = selfParticipant.audio;
        var onHold = audio.isOnHold();
        if (!onHold) {
            // Put call on hold
            audio.isOnHold.set(true).then(function () {
                // Call successfully held
            }, function (error) {
                // Error holding call
            });
        }
        else {
            // Resume call that was on hold
            audio.isOnHold.set(false).then(function () {
                // Call successfully resumed
            }, function (error) {
                // Error resuming call
            });
        }
    }
```
