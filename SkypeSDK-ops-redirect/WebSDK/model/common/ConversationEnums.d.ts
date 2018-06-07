declare module jCafe {
    
    /**
     *      "Text" |
     *      "Html"
     */
    export type MessageFormat = string;

    /**
     *      "Text" |
     *      "Video"
     */
    export type MessageType = string;

    /** The connection state of a call. 
     *  Used to track the state of a chat, audio, video,
     *  screen sharing connection for each participant.
     *
     *       "Disconnected"
     *       "Notified"
     *       "Connecting"
     *       "Ringing"
     *       "Connected"
     *       "Disconnecting"
     */
    export type CallConnectionState = string;


    /** The reason why the call has ended.
     *
     *       "Terminated"            // Call has been normally terminated by 
     *                                  host or either of dialog partners.
     *       "FullSession"           // Call has already reached maximum number 
     *                                  of participant.
     *       "Busy"                  // Remote endpoint is busy or unavailable.
     *       "Refused"               // Call has been refused by the other party 
     *                                  or by the infrastructure.
     *       "Missed"                // Call has not been answered by the other 
     *                                  party and timed out.
     *       "Dropped"               // Call has been dropped due to connection 
     *                                  or network problem.
     *       "InvalidNumber"         // Invalid PSTN number has been called.
     *       "ForbiddenNumber"       // Forbidden PSTN number has been called.
     *       "EmergencyCallDenied"   // Emergency PSTN number from a country 
     *                                  that we do not support has been called.
     *       "VoiceMailFailed"       // Either recording or playback of voicemail 
     *                                  has failed.
     *       "TransferFailed"        // Call could not be transferred to different 
     *                                  endpoint.
     *       "InsufficientFunds"     // User cannot place or transfer the PSTN 
     *                                  call because of insufficient funds, 
     *                                  blocked account or missing subscription.
     *       "Failed"                // Call failed for some other reason.
     *       "MissingSpeaker"        // Call disconnected by Corelib due to no 
     *                                  speaker connected
     *       "OutOfBrowserCall"       // In-browser calling is not supported
     */
    export type CallDisconnectionReason = string;

    /**
     * .start.set.enabled.reason.code in 
     * Conversation::audioService/Conversation::videoService
     * tells why the call cannot be made, e.g. browser not supported, plugin blocked. 
     * This way users get meaningful messages explaining why they cannot make a call.
     *
     *       "PluginNotInstalled"
     *       "PluginOutOfDate"
     *       "BrowserNotSupported"
     *       "PluginBlocked"
     *       "OSNotSupported"
     */
    export type CallNotSupportedReason = string;
}
