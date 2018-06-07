/// <reference path="pm.d.ts" />
/// <reference path="ConversationService.d.ts" />

declare module jCafe {
    /**
     *  Audio component of a conversation.
     *
     *  ::start starts the outgoing audio call.
     *  ::accept and ::reject handle the incoming call.
     *  ::stop will terminate the call.
     *
     *  If video is started it will stop the video service.
     */
    export interface AudioService extends ConversationService {
        /** When was the last call started/accepted? */
        callConnected: Property<Date>;

        /** Sends a DTMF tone. */
        sendDtmf: Command<(dtmf: string) => Promise<void>>;
    }
}