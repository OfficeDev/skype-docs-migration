/// <reference path="Person.d.ts" />
/// <reference path="ChatService.d.ts" />
/// <reference path="HistoryService.d.ts" />
/// <reference path="Participant.d.ts" />
/// <reference path="AudioService.d.ts" />
/// <reference path="VideoService.d.ts" />

declare module jCafe {
    /** Indicates modalities that are active in the conversation. */
    type Modalities = Capabilities;

    /**
     * After a conversation is disconnected it remains in the conversations 
     * collection and can be resumed by starting any of the services
     */
    export interface Conversation {
        /** Creates a participant model for a given person model.
         *  Then the participant needs to be added to the collection.
         */
        createParticipant(person: Person): Participant;

        /** Participants that leave the conversation switch to the disconnected state,
         *  but remain in the collection. 
         *  To remove a participant p, use participants.remove(p).
         */
        participants: Collection<Participant>;

        /** 
         * Number of the participants in conversation.
         * Note that this number might be different than participants length
         * as participant collection might be lazy loaded. 
         */
        participantsCount: Property<number>;
        
        /** A participant model representing the currently signed in user */
        selfParticipant: Participant;

        /** The topic can only be set before any of the services in the 
         * conversation are started.
         */
        topic: Property<string>;

        /** null for a 1:1 conversation, a conference SIP URI for a multiparty 
         * conversation.
         */
        uri: Property<string>;

        /** 
         * When truthy, anyone with uri to group conversation can join.
         * When falsy, only existing users can add new participants.
         * It's enabled only for group conversations.
         */
        isJoiningEnabled: Property<boolean>;
        
        isGroupConversation: Property<boolean>;

        /** The conversation organizer. 
            For p2p conversations the creator is the one who started the conversation.
            For meetings the creator is who created the meeting. */
        creator: Person;
        
        historyService: HistoryService;
        audioService: AudioService;
        videoService: VideoService;
        chatService: ChatService;

        /**
         * These properties reflect the modalities that are actually present in the
         * conversation, and not the services that are started.
         *
         * For example, an online meeting may have two active modalities - Messaging and Audio,
         * and both properties will be enabled in the activeModalities model.
         * But the app may ignore the audio part of the conversation and not call
         * conversation.audioService.start(), so the conversation will have
         * only chatService started. activeModalities provides a hint to
         * the app when it should start the audio service in an online meeting if it did not
         * do it when the conversation was created.
         *
         *     conversation.activeModalities.audio.when(true, () => {
         *         conversation.audioService.start();
         *     });
         */
        activeModalities: Modalities;

        /**
         * Stops all the modalities in the conversation and then terminates
         * the conversation itself. In the conferencing mode this results
         * in quitting from the multiparty conversation. If the conversation
         * is already stopped, this method is a noop.
         */
        leave: Command<() => Promise<void>>;

        /**
         * Acknowledge user-awareness of auto-accepted conversation.
         *
         * When a conversation is auto-accepted by UCWA, the conversation
         * resource will be updated with the 'userAcknowledged' link, which
         * will enable this command. Calling the command will POST to the
         * link, notifying UCWA not to mark the conversation as "missed".
         */
        acknowledge: Command<() => Promise<void>>;
    }
}