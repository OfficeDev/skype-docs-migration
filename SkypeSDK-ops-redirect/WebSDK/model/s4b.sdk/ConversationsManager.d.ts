declare module jCafe {
    export interface ConversationsManager {
        /** 
         * This method finds or creates a conversation with a given SIP URI.
         */
        getConversation(sipUri: string): Conversation;

        /**
         * Schedules a meeting, but doesn't join it.
         * To join ameeting, one can use getConversationByUri.
         */
        createMeeting(): ScheduledMeeting;

        /**
         * Reflects the current state on ucwa regarding whether history is enabled.
         * isHistoryEnabled can only be changed once the sdk is connected to the server and
         * when rel=communication has an etag value.
         * Once enabled, if set to false it disables history on ucwa and stops ucwa from auto accepting IMs.
         * 
         * Set isHistoryEnabled.auto to false after creating the app and before signing in if the app 
         * does not want the sdk to automatically enable conversation history.
         */
        isHistoryEnabled: Property<boolean> & { auto: Property<boolean> };
    }
}