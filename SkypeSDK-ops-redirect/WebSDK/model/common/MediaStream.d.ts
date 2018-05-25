declare module jCafe {
    /** Inactive and Active states reflect the media flow state of the started stream;
     *  an inactive stream is usually a started stream without an attached renderer
     *
     *       'Started'
     *       'Active'
     *       'Inactive'
     *       'Stopped'
     */
    export type MediaStreamState = string;
    
    /**
     *
     *      "Fit"        // resize the video frame to fit the container window 
     *                      without changing the frame aspect ratio;  this can 
     *                      cause black bars around the video (letterboxing)
     *      "Crop"       // crop the video frame to occupy the entire container 
     *                      window without changing the frame aspect ratio
     *      "Stretch"    // stretch the video frame to occupy the entire 
     *                      container window; changes the video frame aspect 
     *                      ratio potentially distorting the image
     */
    export type VideoFormat = string;

    /**
     * Media stream source sink defines a container where video should be rendered.
     * The container property should hold a reference to a DOM Node where stream
     * should be rendered. Whenever container is updated video should render in the
     * new container instead of the old one.
     *
     * Toggle (hide and show) video using DOM and CSS may be desirable in a websdk
     * application that needs to handle multiple conversations, where more than one
     * conversation can have video and the application wants to show one video at a
     * time and switch between multiple video sources using a button.
     *
     * The application can achieve this using the "visibility" property in CSS:
     *
     *      $("#videoContainer1").css("visibility", "hidden"); // to hide container
     *      $("#videoContainer2").css("visibility", "visible"); // to show container
     *
     * The same effect can NOT be achieved using the "display" property. In other
     * words, setting $("#videoContainer1").css("display", "none") might unload the
     * plugin object such that setting the display back to "block" will not bring the
     * video back.
     *
     * It is worth noting the following equivalence:
     *
     *      $("#container1").hide() equals $("#container1").css('display', 'none')
     *      $("#container1").show() equals $("#container1").css('display', 'block')
     *
     * It means using the jQuery "hide()" and "show()" functions will not achieve the
     * aforementioned toggle effect.
     *
     * Similarly, attempting to detach the DOM element and then append it back might
     * not achieve the toggle effect either. The detach operation would remove the
     * element, which might cause the plugin object to be unloaded.
     *
     * In order to achieve the effect using DOM, the application can set the container
     * of the video stream to 'null' and later back to the right DOM element:
     *
     *      var container = conversation.participant(0).video.channels(0).stream.source.sink.container;
     *      container(null); // to hide video
     *      container(document.getElementById(‘videoContainer1’)); // to show video
     */
    export interface StreamSink {
        container: Property<HTMLElement>;
        format: Property<VideoFormat>;
    }

    /** 
     * Media stream source is used for stream rendering.
     *
     * Every stream source has one sink which defines
     * a container where video should be rendered 
     */
    export interface MediaStreamSource {
        sink: StreamSink
    }

    /** The participant media stream may represent participant's video 
        or screen sharing streams. */
    export interface MediaStream {
        state: Property<MediaStreamState>;

        /** Presents this stream for rendering.  */
        source: MediaStreamSource;

        /** Width of video resolution (for video) or shared area rectangle 
         * (for screen sharing) 
         */
        width: Property<number>;

        /** Height of video resolution (for video) or shared area rectangle 
         * (for screen sharing) 
         */
        height: Property<number>;
    }
}
