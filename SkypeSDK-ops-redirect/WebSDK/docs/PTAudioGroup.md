
# Group Audio Conversation


 _**Applies to:** Skype for Business 2015_

## Starting a group audio conversation

The application object exposes a conversationsManager object which we can use to create new group conversation by calling createConvresation().  After creation of the conversation object, it is helpful to setup a few event listeners for when we are connected to audio, added participants, when participants are connected to audio, and when we disconnect from the conversation.

We can add participants to the conversation by calling add(...) providing a SIP URI on the participants collection of the conversation object.  We can use the audioService on the conversation object and call start() to initiate the call.

After the conversation and audio modality are established we can begin communicating with the remote parties.  When finished click the end button to terminate the conversation.


### Start a group audio conversation

1. Start group audio conversation, and track participant events 

  ```js
    var conversationsManager = application.conversationsManager;
    conversation = conversationsManager.createConversation();

    conversation.selfParticipant.audio.state.when('Connected', function () {
        conversation.participants.added(function (person) {
            person.audio.state.when('Connected', function () {
				// Conversation established
            });
        });
    });

    conversation.state.changed(function (newValue, reason, oldValue) {
        if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
            // Conversation ended
        }
    });

    conversation.participants.add('sip:xxx');
    conversation.participants.add('sip:yyy');
    conversation.audioService.start().then(null, function (error) {
        // handle error
    });
  ```

2. **Advanced**: Track remote participant audio mute state

    ```js
    person.audio.isMuted.when(true, function () {
        // person.displayName() muted their audio
    });
    person.audio.isMuted.when(false, function () {
       // person.displayName() unmuted their audio
    });
  ```

3. End the conversation

  ```js
    conversation.leave().then(function () {
        // conversation ended
    }, function (error) {
        // handle error
    }).then(function () {
        // clean up operations
    });
  ```
