/// <reference path="pm.d.ts" />
/// <reference path="VideoChannel.d.ts" />
/// <reference path="ConversationEnums.d.ts" />

declare module jCafe {
    
    export interface ParticipantVideo {
        /** 
         * The connection state of this participant's video. 
         *
         * This is the signalling state. The state of the media
         * stream is exposed by MediaStream::state 
         */
        state: Property<CallConnectionState>;

        /** 
         * Available video channels.
         *
         * For a local participant there is always one VideoChannel regardless of 
         * whether any cameras are attached to the system. This collection is 
         * automatically updated when a camera is plugged or unplugged. 
         */
        channels: Collection<VideoChannel>;
    }
}
