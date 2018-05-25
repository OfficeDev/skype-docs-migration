/// <reference path="pm.d.ts" />
/// <reference path="MediaStream.d.ts" />

declare module jCafe {
    /**
     * Participant's video channel
     *
     * The video channel represents a single video connection. For a local 
     * participant it holds a video stream from one of the attached cameras. 
     * For a remote participant it holds one of the remote video streams.
     * 
     * Source property of the MediaStream interface is implementation-specific 
     * - see the comment for MediaStreamSource. For a plugin-based implementation 
     * it holds a StreamSink which represents a an HTML element that would host 
     * the native window created by the plugin to render the video stream.
     * 
     * Example:
     * 
     * Show video of participant A in <div id="renderWindow">:
     * 
     *     pA.video.channels(0).stream.source.sink.container(
     *          document.getElementById('renderWindow'));
     *     pA.video.channels(0).isStarted(true);
     *
     * Replace participant A's video with participant B's video:
     * 
     *     pB.video.channels(0).isStarted(true);
     *     pA.video.channels(0).stream.source.sink.container(null);
     *     pB.video.channels(0).stream.source.sink.container(
     *          document.getElementById('renderWindow')); 
     *     pA.video.channels(0).isStarted(false); 
     */
    export interface VideoChannel {
        /** 
         * A video device description for this channel.
         *
         * Camera should provide a camera description that can be used
         * for channel identification in the UI. 
         */
        camera: Property<string>;

        /** 
         * Participant's video stream.
         *
         * In a plugin-based implementation a media stream may be started by the 
         * Start method of this interface but the media packets will start 
         * flowing only after at least one sink (rendering window) is added to
         * MediaSource. The app can detect the media flow start by observing the 
         * stream state. That state is Active when the media starts to flow and 
         * becomes Inactive when media stops (which happens when there are no
         * rendering windows). The app may elect to display the participant's 
         * photo instead of their video until the stream state becomes Active 
         * rather than Started, otherwise a user may see a dark window during 
         * the stream transion from Started to Inactive to Active.  
         */
        stream: MediaStream;

        /** 
         * Set this property to start/stop streaming video on this video channel.
         *
         * Setting this property to true for the local participant starts video 
         * on this channel. This property is read-only for a remote participant 
         * in 1:1 conversation. For a remote participant in a multiparty 
         * conversation setting this property to true does not start this 
         * participant's video remotely, it just tells the conference that the 
         * local participant wants to see (subscribe to) the remote participant's 
         * video. Similarly, setting it to false does not stop this participant's 
         * video remotely, it just tells the conference that the local 
         * participant wants to unsubscribe from the remote participant's video. 
         */
        isStarted: Property<boolean>;


        /**
         * The value of this property indicates whether or not a participant is
         * attempting to stream video.
         *
         * It may be used in gallery view during group calls to decide which
         * remote participant can be promoted to stage because they have video.
         * 
         * For a remote participant in a 1:1 call it indicates that the remote
         * party has turned on video, but not necessarily that we are rendering the
         * video. For instance, if the remote turns on video but we have not set
         * a container for her video stream, no video will be rendered but this
         * property will be true. The same is true for the local participant in
         * both 1:1 and group calls.
         *
         * This is a read-only property.
         */
        isVideoOn: Property<boolean>;

        /** Set this property to hold/resume video on this channel for the local 
         * participant. For a remote participant this property is read-only and 
         * is true when the remote participant is holding video on this channel. 
         */
        isOnHold: Property<boolean>;
    }
}
