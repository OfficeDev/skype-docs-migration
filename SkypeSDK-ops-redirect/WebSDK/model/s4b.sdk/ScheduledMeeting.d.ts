declare module jCafe {
    /**
     * Represents a meeting that is scheduled, but not joined.
     * To schedule a meeting, set appropriate properties and
     * then get the meeting URI:
     *
     *      app.conversationsManager.createMeeting()
     *          .accessLevel("Everyone")
     *          .subject("Test")
     *          .expirationTime(new Date + 5 * 24 * 3600)
     *          .onlineMeetingUri.get();
     *
     * Then the URI can be sent to attendees and they can join.
     *
     * See also how to schedule online meetings with UCWA:
     * msdn.microsoft.com/en-us/library/office/dn356790.aspx
     */
    export interface ScheduledMeeting {
        onlineMeetingUri: Property<string>;

        /** The URL that is used when the online meeting is joined from the web. */
        joinUrl: Property<string>;

        /** 
         * Identifies this meeting among the other online meetings that are scheduled by the organizer.
         * The online meeting ID is unique within the organizer's list of scheduled online meetings. 
         */
        onlineMeetingId: Property<string>;

        /**
         * The URI of the online meeting organizer: the person who scheduled the meeting.
         * Organizers can enumerate or change only the conferences that they organize.
         */
        organizerUri: Property<string>;

        /**
         * Controls who is let into the meeting:
         *
         *      Everyone
         *      Invited         Only users in the attendees/leaders, all others are put in the lobby.
         *      Locked          All users except the organizer are put into the lobby.
         *      SameEnterprise  Only users from the same enterprise, all others are put in the lobby.
         */
        accessLevel: Property<string>;

        /** SIP URIs of users to include as attendees. */
        attendees: Collection<string>;

        /**  SIP URIs of users to include as leaders. The organizer will automatically be added to the leaders list. */
        leaders: Collection<string>;

        subject: Property<string>;
        description: Property<string>;

        /**
         * The UTC date and time after which the online meeting can be deleted.
         *
         * The day and time must be between one year before, and ten years after,
         * the current date and time on the server. If the expiration time is specified,
         * it must point to a moment in the future.
         */
        expirationTime: Property<Date>;

        /**
         * Which participants are automatically promoted to leaders.
         *
         * An online meeting organizer can schedule a meeting so that users are automatically promoted
         * to the leader role when they join the meeting. For example, if the meeting is scheduled with
         * automatic promotion policy set to "SameEnterprise", then any participants
         * from the organizer's company are automatically promoted to leaders when they join the meeting.
         * Conference leaders can still promote specific users to the leader role, including anonymous users.
         */
        automaticLeaderAssignment: Property<string>;

        /**
         * The attendance announcements status for the online meeting.
         *
         * When attendance announcements are enabled, the online meeting will announce the names
         * of the participants who join the meeting through audio.
         */
        entryExitAnnouncement: Property<string>;

        /** When enabled phone users will skip the meeting lobby. */
        lobbyBypassForPhoneUsers: Property<string>;

        /** 
         * Whether participants can join the online meeting over the phone.
         *
         * Setting this property to true means that online meeting participants can join the meeting
         * over the phone through the Conferencing Auto Attendant (CAA) service.
         */
        phoneUserAdmission: Property<string>;
    }
}