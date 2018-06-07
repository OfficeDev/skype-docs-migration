/// <reference path="pm.d.ts" />
/// <reference path="ParticipantChat.d.ts" />
/// <reference path="ParticipantAudio.d.ts" />
/// <reference path="ParticipantVideo.d.ts" />

declare module jCafe {
    /**
     *       "Attendee"
     *       "Leader"
     */
    export type ParticipantRole = string;
    
    /**
     *       "Disconnected" 
     *       "Connecting"
     *       "InLobby"
     *       "Connected"
     *       "Disconnecting"
     */
    export type ParticipantState = string;

    /**
     * A participant represents a contact in a conversation.
     *
     * In large online meetings there may be hundreds of participants, so to
     * reduce the network traffic the server sends as little information as
     * possible. UI needs to choose a small subset of participants that are
     * currently being displayed to the user and subscribe to only these
     * participant models:
     *
     *      visibleParticipants.forEach((participantView) => {
     *          var participant = participantView.getModel();
     *
     *          // now subscribe to the participant
     *          bindProperty(participant.admit.enabled, buttonAdmit);
     *          bindProperty(participant.reject.enabled, buttonReject);
     *      });
     *
     * A subscription to a participant model tells that model to keep itself
     * up to date by sending extra requests to the server. Too many such
     * subscriptions may add too much network traffic.
     */
    export interface Participant {
        isAnonymous: Property<boolean>;
        state: Property<ParticipantState>;

        /** Change this property to promote or demote the participant. */
        role: Property<ParticipantRole>;

        /**
         *  For the local participant this is the MePerson. 
         */
        person: Person;
        
        chat: ParticipantChat;
        audio: ParticipantAudio;
        video: ParticipantVideo;

        /** 
         * Admits a remote participant into the online meeting. 
         * This is only enabled if the remote participant is waiting in the Lobby.
         *
         * To fetch the value of the `enabled` property once, use its `get` method:
         *
         *     participant.admit.enabled.get().then((isEnabled) => {
         *         participant.admit();
         *     });
         *
         * This doesn't create any subscriptions, but if the actual value 
         * of the property changes, the only way to get it on time is to 
         * subscribe to its `changed` event.
         */
        admit: Command<() => Promise<void>>;
    }
}