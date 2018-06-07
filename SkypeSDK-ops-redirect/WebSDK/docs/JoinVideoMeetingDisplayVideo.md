
# Join a meeting with video and display the video streams


 _**Applies to:** Skype for Business 2015_

With an existing conversation instance, video can be added or removed.


### Joining a meeting with video


 
  ```js
  var uri = 'yourmeetinguri';
var conversation = client.conversationsManager.getConversationByUri(uri);
conversation.videoService.start();

  ```


### Adding video streams from the conference


 
  ```js
  var conversation = client.conversations(0);
var channel = conv.participants(0).video.channels(0);
channel.stream.source.sink.container.set(document.getElementById('renderWindow')).then(function () {
    channel.isStarted.set(true);
});
var channel2 = conv.participants(1).video.channels(0);
channel2.stream.source.sink.container.set(document.getElementById('renderWindow2')).then(function () {
    channel2.isStarted.set(true);
});
// Add video from more participants as needed

  ```


>**Note:** Setting the video container more than one time for the same video stream will cause problems with video playback.
    

### Removing video streams from the conference


 
  ```js
  var conversation = client.conversations(0);
var channel = conv.participants(0).video.channels(0);
channel.stream.source.sink.container(document.getElementById('renderWindow'));
channel.isStarted.set(false);
var channel2 = conv.participants(1).video.channels(0);
channel2.stream.source.sink.container(document.getElementById('renderWindow2'));
channel2.isStarted.set(false);
// Remove video from more participants as needed

  ```

