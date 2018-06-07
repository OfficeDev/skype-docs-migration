/// <reference path="../common/Application.d.ts"/>
/// <reference path="Conversation.d.ts"/>
/// <reference path="AudioService.d.ts"/>
/// <reference path="PhoneAudio.d.ts"/>
/// <reference path="ConversationExtension.d.ts"/>
/// <reference path="ConversationsManager.d.ts"/>
/// <reference path="ScheduledMeeting.d.ts"/>
/// <reference path="Group.d.ts"/>
/// <reference path="ParticipantAudio.d.ts"/>
/// <reference path="Person.d.ts"/>

declare module jCafe {
    export interface Application {
        /** 
         * Allows to collect OII (organizational identifiable information)
         * such as FQDNs. OII doesn't include PII, which is the user's SIP
         * address, email or other data linkable to an individual user.
         *
         * Enabled by default.
         */
        collectOII: Property<boolean>;
    }
}
