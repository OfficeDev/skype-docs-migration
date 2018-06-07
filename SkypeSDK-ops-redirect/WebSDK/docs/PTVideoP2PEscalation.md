
# P2P Video Escalation


 _**Applies to:** Skype for Business 2015_

[!INCLUDE[ChromeWarning](includes/P2PChromeWarning.md)]

## Escalating a P2P video conversation

The application object exposes a conversationsManager object which we can use to create new conversations by calling getConversation(...) and providing a SIP URI.  After creation of the conversation object it is helpful to setup a few event listeners for when we are connected to video, added participants, when participants are connected to video, and when we disconnect from the conversation.  We can use the videoService on the conversation object and call start() to initate the call and send an invitation.

When either the selfParticipant or other persons are conencted to video we also need to setup the DOM element where the video should be displayed.  This configuration can be handled by getting access to the sink object by walking from the person object to the video modality to the channels collection choosing the first, or channels(0), which gives us access to the stream object which has a source object which finally points us to the sink object.  The sink object has a format property that can accept video formatting options such as Stretch, Fit, and Crop.  The sink object also exposes a container property where we can provide a DOM element where the video will be inserted.

We can use the participants collection of the conversation and call add(...) providing a SIP URI to invite additional persons.  They will receive an invitation and if they accept will be added to the conversation.  In the case of a peer-to-peer, P2P, conversation the server will escalate it to a conference.

After the conversation and video modality are established we can begin communicating with the remote party.  When finished click the end button to terminate the conversation.


### Escalate a P2P video conversation

1. Start a P2P video conversation, and set up associated listeners 

    ```js
    var conversationsManager = application.conversationsManager;
    conversation = conversationsManager.getConversation('sip:xxx');

    conversation.selfParticipant.video.state.when('Connected', function () {
        // set up local video container
        conversation.selfParticipant.video.channels(0).stream.source.sink.format('Stretch');
        conversation.selfParticipant.video.channels(0).stream.source.sink.container(/* DOM node */);

        conversation.participants.added(function (person) {
            // person.displayName() has joined the conversation
            person.video.state.when('Connected', function () {
                // set up remote video container
                person.video.channels(0).stream.source.sink.format('Stretch');
                person.video.channels(0).stream.source.sink.container(/* DOM node */);

                if (conversation.isGroupConversation()) {
                    person.video.channels(0).isStarted(true);
                }
            });
        });
    });

    conversation.state.changed(function (newValue, reason, oldValue) {
        if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
            // conversation ended
        }
    });
    conversation.videoService.start().then(null, function (error) {
        // handle error
    });
    ```

2. **Advanced**: Track remote participant video state

    ```js
    person.video.channels(0).isVideoOn.when(true, function () {
        // person.displayName() started streaming their video
    });
    person.video.channels(0).isVideoOn.when(false, function () {
        // person.displayName() stopped streaming their video
    });
    ```

3. Add another person to escalate the P2P video conversation to a group video conversation

    ```js
    conversation.participants.add('sip:xxx').then(function () {
        // participant successfully added
    }, function (error) {
        // handle error
    });
    ```

4. End the conversation

    ```js
    conversation.leave().then(function () {
        // conversation ended
    }, function (error) {
        // handle error
    }).then(function () {
        // clean up operations
    });
    ```
