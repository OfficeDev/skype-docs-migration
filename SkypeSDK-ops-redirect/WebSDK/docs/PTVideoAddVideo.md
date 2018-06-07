
# Add Video to an Audio Conversation


 _**Applies to:** Skype for Business 2015_

[!INCLUDE[ChromeWarning](includes/P2PChromeWarning.md)]

## Adding Video to an Audio Conversation

The application object exposes a conversationsManager object which we can use to create new conversations by calling getConversation(...) and providing a SIP URI.  After creation of the conversation object it is helpful to setup a few event listeners for when we are connected to audio, added participants, and when we disconnect from the conversation.  We can use the audioService on the conversation object and call start() to initate the call and send an invitation.

Before adding video to the conversation we need to setup a few event listeners to know when we are connected to video and any other participant is connected.  We need to do this to properly setup the video container DOM element.  To add video to the covnersation we use the video property on the object and call the start() method.  It will add the local video to the conversation, but will not force the remote party to start their video.

After the conversation and audio/video modality are established we can begin communicating with the remote party.  When finished click the end button to terminate the conversation.


### Add Video

1. Initiate an audio conversation with a person 

    ```js
    var conversationsManager = application.conversationsManager;

    conversation = conversationsManager.getConversation('sip:xxx');

    conversation.selfParticipant.audio.state.when('Connected', function () {
        // Connected to Audio
    });
    conversation.participants.added(function (person) {
        // person.displayName() has joined the conversation
    });
    conversation.state.changed(function (newValue, reason, oldValue) {
        if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
            // conversation ended
        }
    });
    conversation.audioService.start().then(null, function (error) {
        // handle error
    });
    ```

2. Add Video

    ```js
    conversation.selfParticipant.video.state.when('Connected', function () {
        // set up self video container
        conversation.selfParticipant.video.channels(0).stream.source.sink.format('Stretch');
        conversation.selfParticipant.video.channels(0).stream.source.sink.container(/* DOM node */);
        // connected to video
    });
    conversation.participants.added(function (person) {
        person.video.state.when('Connected', function () {
            // set up remote video container
            person.video.channels(0).stream.source.sink.format('Stretch');
            person.video.channels(0).stream.source.sink.container(/* DOM node */);
        });
    });
    conversation.videoService.start(null, function (error) {
        // handle error
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
