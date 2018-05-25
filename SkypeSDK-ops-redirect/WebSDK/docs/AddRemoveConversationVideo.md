
# Add or remove video in a conversation


 _**Applies to:** Skype for Business 2015_

 **In this article**  
[Add video to a conversation](#sectionSection0)  
[Remove video from a conversation](#sectionSection1)  
[Subscribe to changes from the videoService in a conversation](#sectionSection2)  
[Accept video without sending video](#sectionSection3)  


With an existing conversation instance, video can be added or removed.

## Add video to a conversation
<a name="sectionSection0"> </a>



  ```js
  conversation.videoService.start().then(function () {
    // Successfully added video to the conversation
    // Set the video window container
    conversation.selfParticipant.video.channels(0).container(document.getElementById("renderWindow"));
    channel.isStarted.set(true);
});

  ```


You may also set the video window container prior to starting the videoService.

    
  ```js
  // Set the video window container
  conversation.selfParticipant.video.channels(0).container(document.getElementById("renderWindow"));
  conversation.videoService.start().then(function () {
    // Successfully added video to the conversation
    conversation.selfParticipant.video.channels(0).isStarted.set(true);
  });

  ```


>**Note:** Setting the video container more than one time for the same video stream will cause problems with video playback.
    

## Remove video from a conversation
<a name="sectionSection1"> </a>



  ```js
  Conversation.videoService.stop().then(function () {
    // Successfully removed video from the conversation
});

  ```


Video can also be removed by stopping the audioService.
    
  ```js
  Conversation.audioService.stop().then(function () {
    // Successfully removed audio and video from the conversation
});
  ```


## Subscribe to changes from the videoService in a conversation
<a name="sectionSection2"> </a>

An event is fired when the client has successfully added video to the conversation, or another participant has invited the client to add video.


1. Subscribe to the event.

  ```js
  conversation.selfParticipant.video.state.changed(function (val) {
…
});
  ```

2. If the **val** argument in the previous snippet indicates the event is an invitation to add video, the client may reject or accept the invitation.

  ```js
  if (val == 'Notified') {
    if (confirm('Accept incoming video request?')) {
        console.log('accepting the incoming video request');
        conversation.videoService.accept();
        console.log('Accepting incoming video request');
    }
    else {
        console.log('declining the incoming video request');
        conversation.videoService.reject();
    }
}
  ```


## Accept video without sending video
<a name="sectionSection3"> </a>

Clients can accept requests for video without sending their own video by calling **audioService.accept()**.


1. Subscribe to the video state changed event.

  ```js
  conversation.selfParticipant.video.state.changed(function (val) {
…
});

  ```

2. If the **val** argument in the previous snippet indicates the event is an invitation to add video, the client may accept the invitation without sending the client's video.

  ```js
  if (val == 'Notified') {
    conversation.audioService.accept();
}

  ```

3. The client's video can be added later.

  ```js
  conversation.selfParticipant.video.channels(0).isStarted(true);
  ```

