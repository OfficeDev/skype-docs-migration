declare module jCafe {

    export interface ParticipantChat {
        state: Property<CallConnectionState>;
        isTyping: Property<boolean>;
    }
}
