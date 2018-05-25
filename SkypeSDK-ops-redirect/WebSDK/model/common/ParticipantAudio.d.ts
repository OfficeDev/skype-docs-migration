declare module jCafe {
    
    export interface ParticipantAudio {
        /** Connection state of this participant's audio */
        state: Property<CallConnectionState>;

        /** Set this property to mute/unmute this participant (local or remote) */
        isMuted: Property<boolean>;

        /** 
         * For the local participant set this property to hold/resume the call;
         * for a remote participant this property is read-only and is true when
         * the remote participant is holding the call. 
         */
        isOnHold: Property<boolean>;

        /** True if there is audible sound in the channel */
        isSpeaking: Property<boolean>;
        
        /**
         * Defines the endpoint where the participant is being reached
         * To reach participant on Skype network and have Skype to Skype audio, 
         * set it to corresponding person.id - this is default value
         * To reach participant on phone network and have Skype to PSTN audiocall, 
         * set it to corresponding person.phoneNumbers[].telUri
         */
        endpoint: Property<string>;
    }
}