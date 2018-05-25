
# Switch between video streams across conversations



This topic shows you how to use JavaScript to show and hide video streams in multiple conversations hosted by a single app. If your app can host multiple conversations simultaneously, you will need to be able to hide a conversation's video when a user wants the video in another conversation shown. 

## Show or hide a video container using CSS

Use the jQuery alias '$' to get the DOM element that contains the video sink that you want to hide.


```js
$('#videoContainer1').css('visibility', 'hidden'); // to hide container
```

Use the jQuery alias '$' to get the DOM element that contains the video sink that you want to show.




```js
$('#videoContainer2').css('visibility', 'visible'); // to show container
```

You can also switch between conversation video by using the DOM. The following example sets the container of the video stream to null and then later restores the container.




```js
var container = conversation.participant(0).video.channels(0).stream.source.sink.container;
     container(null); // to hide video
//... other app logic
     container(document.getElementById('videoContainer1')); // to show video

```


## Why not use other CSS attributes to hide or show video?

You may wonder why we don't want you to use other CSS properties, such as  **display**. If you use any property except for **visibility**, the video plug-in object may be unloaded. Setting the property value back to 'block' does not bring the plug-in back.

Detaching the video container DOM element removes the element and can cause the video plug-in to be unloaded. 


## Additional resources


[ParticipantVideo](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.participantvideo.html)
