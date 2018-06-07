/// <reference path="pm.d.ts" />
/// <reference path="Participant.d.ts" />
/// <reference path="ConversationService.d.ts" />

declare module jCafe {

    /** 
     *      'ActiveSpeaker'
     *      'MultiView'
     *      'Both'
     */
    export type VideoMode = string;

    /**
     *  Active (dominant) speaker in a multiparty call.
     *
     *  Some media platforms do not support simultaneous multiple remote-party video, but generate
     *  a single video stream which switches between dominant speakers. This interface is the only
     *  representation of remote participant video in group calls on such a platform.
     */
    export interface ActiveSpeaker {
        /**
         * A dedicated video channel which video stream carries the current active speaker video.
         * When the active speaker changes this channel switches to the new speaker video.
         */
        channel: VideoChannel;

        /** A reference to the participant model of the current active speaker */
        participant: Property<Participant>;
    }

    /** 
     *  Video component of a conversation.
     *
     *  ConversationService::start either adds video to the exisitng
     *  audio call or starts a new outbound audio/video call, i.e. starts
     *  the AudioService as well. Accept and Reject handle the incoming
     *  video invitation. Stop removes the video portion of the AV call.
     *  On Skype it will stop the ScreenSharing service as well. 
     */
    export interface VideoService extends ConversationService {

        /** video mode supported by the platform */
        videoMode: Property<VideoMode>;
        
        /**
         *  Number of participants' video streams that can be displayed in
         *  a multiparty call simultaneously if the platform supports multi-video.
         *  This is the upper bound defined by the platform.
         */
        maxVideos: Property<number>;

        /** The active (dominant) speaker in this conversation */
        activeSpeaker: ActiveSpeaker;
    }
}
