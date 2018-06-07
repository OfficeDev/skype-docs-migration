/// <reference path="pm.d.ts" />

declare module jCafe {
    /** 
     * Base conversation service describing the common functionality of 
     * conversation modalities. 
     * (chat, audio, video, screen sharing).
     *
     * The conversation is a communication session with a finite lifetime. 
     * The conversation modalities (chat, audio, video, screen sharing) can be 
     * started or stopped anytime during the life of the conversation. 
     * The incoming invitations for various conversation modalities have to be 
     * accepted or rejected.
     */
    export interface ConversationService {
        start: Command<() => Promise<void>>;
        stop: Command<() => Promise<void>>;
        accept: Command<() => Promise<void>>;
        reject: Command<() => Promise<void>>;
    }
}