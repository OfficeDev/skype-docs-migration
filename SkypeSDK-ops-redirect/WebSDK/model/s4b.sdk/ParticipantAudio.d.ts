declare module jCafe {
    
    export interface ParticipantAudio {
        
        /**
         * Meeting presenters can mute or unmute other meeting participants, but when
         * a presenter unmutes a participant the participant must be notified, and 
         * until the end user accepts, the jLync app must not resume transmitting sound.
         * 
         * This is a read-only property which is set to true when a meeting presenter
         * tries to unmute the local participant. When the property becomes true, the
         * end user should be notified that a presenter has requested that he/she unmute.
         * 
         * This property will only ever be true for the local participant.
         */
        isUnmuteRequested: Property<boolean>;
    }
}