
# Outgoing P2P Video Conversation


 _**Applies to:** Skype for Business 2015_

[!INCLUDE[ChromeWarning](includes/P2PChromeWarning.md)]

## Starting an outgoing P2P Video Conversation

The application object exposes a conversationsManager object which we can use to create new conversations by calling getConversation(...) and providing a SIP URI.  After creation of the conversation object it is helpful to setup a few event listeners.

The conversation object exposes a selfParticipant object which we can use to get access to modalities and in this example we are interested in video.  The video modality exposes a state property which we can attach a listener for changed to know when we are connected to the conversation.
The conversation object exposes a participants collection which we can attach a listener for added to know when new people are added to the conversation.  We also want to know when those participants are connected to video.

When either the selfParticipant or other persons are conencted to video we also need to setup the DOM element where the video should be displayed.  This configuration can be handled by getting access to the sink object by walking from the person object to the video modality to the channels collection choosing the first, or channels(0), which gives us access to the stream object which has a source object which finally points us to the sink object.  The sink object has a format property that can accept video formatting options such as Stretch, Fit, and Crop.  The sink object also exposes a container property where we can provide a DOM element where the video will be inserted.

The conversation object exposes a state property which we can subscribe via when(...) to know when we are disconnected from the conversation. The conversation object exposes an videoService object that we can use to initiate the sending the invitation by calling the start() method.

After the conversation and video modality are established we can begin communicating with the remote party.  When finished click the end button to terminate the conversation.


### Start outgoing P2P Video

1. Initiate a video conversation with a person, and set up associated listeners 

    ```js
    var conversationsManager = application.conversationsManager;
    conversation = conversationsManager.getConversation('sip:xxx');

    conversation.selfParticipant.video.state.when('Connected', function () {
    // set up self video container
    conversation.selfParticipant.video.channels(0).stream.source.sink.format('Stretch');
    conversation.selfParticipant.video.channels(0).stream.source.sink.container(/* DOM node */);
    });
    conversation.participants.added(function (person) {
    // person.displayName() has joined the conversation

    person.video.state.when('Connected', function () {
        // set up self video container
        person.video.channels(0).stream.source.sink.format('Stretch');
        person.video.channels(0).stream.source.sink.container(/* DOM node */);
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

2. End the conversation

    ```js
    conversation.leave().then(function () {
        // conversation ended
    }, function (error) {
        // handle error
    }).then(function () {
        // clean up operations
    });
    ```
