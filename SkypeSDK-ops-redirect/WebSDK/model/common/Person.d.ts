/// <reference path="pm.d.ts" />

declare module jCafe {

    /**
     *       "Online"
     *       "Offline"
     *       "Hidden"
     *       "Busy"
     *       "Idle"
     *       "BeRightBack"
     *       "Away"
     *       "DoNotDisturb"
     *       "Unknown"
     */
    export type OnlineStatus = string;

    /** 
     *       "Home"
     *       "Work"
     *       "Cell"
     *       "Other"
     */
    export type PhoneType = string;

    /** 
     *       "Personal"
     *       "Work"
     *       "Other"
     */
    export type EmailType = string;

    /** 
     *       "Home"
     *       "Work"
     *       "Other"
     */
    export type LocationType = string;

    /**
     *       "Personal"
     *       "OutOfOffice"
     */
    export type NoteType = string;

    /**
     *       "Desktop"
     *       "Mobile"
     *       "Web"
     *       "Unknown"
     */
    export type EndpointType = string;
    
    export interface PhoneNumber {
        type: Property<PhoneType>;
        
        /** Resembles tel:+1xxxxxxxxxx */
        telUri: Property<string>;
        displayString: Property<string>;
    }
    
    export interface Email {
        type: Property<EmailType>;
        emailAddress: Property<string>;
    }

    // documented in s4b.sdk
    export interface Location {
    }

    export interface Status extends Property<OnlineStatus> {
    }
    
    export interface Note {
        type: Property<NoteType>;
        text: Property<string>;
    }    
    
    export interface Capabilities {
        chat: Property<boolean>;
        audio: Property<boolean>;
        video: Property<boolean>;
    }

    /**
     * A read-only representation of a Person in a contact list or in a search query.
     *
     * A Person model is created on top of a "contact" resource from UCWA.
     * When created, it does not send any HTTP requests to get additional
     * information about the Person, but waits for the view layer
     * (or whoever created the Person model) to subscribe to one of the
     * Person model properties. For example, when the caller starts
     * listening to Person name changes
     *
     *      person1.displayName.changed((name) => {
     *          console.log("the contact's name is " + name);
     *      });
     *
     * the Person model checks whether the property is already
     * available and if so, the Person model does not fetches it
     * again from the server, If the property value is not available,
     * the Person model sends all HTTP server requests necessary to obtain
     * that value. For example for the
     * code snippet above where someone subscribes to the "displayName" property,
     * the Person model sends up to one HTTP request to load the resource:
     *
     *      GET /contacts/126173
     *
     * For more complicated properties, like "status", it may be necessary
     * to send extra HTTP requests to create a presence subscription. So when
     * someone starts listening to the "status" property
     *
     *      sub = person1.status.subscribe();
     *      person1.status.changed(onPresenceChanged);
     *      function onPresenceChanged(presence) {
     *          console.log("the contact is " + presence.availability);
     *      }
     *
     * the Person model sends a POST request to create a presence subscription
     * (in addition to all requests that are necessary to get the URL to which
     * that POST request can be sent):
     *
     *      POST /contacts/126173/presencesubscriptions
     *
     *      {"Uris":["sip:johndoe@contoso.com"], "Duration":"11"}
     *
     * But after the view stops listening to the property
     *
     *      sub.dispose();
     *
     * the Person model sends a DELETE request to remove the presence subscription:
     *
     *      DELETE /contacts/126173/presencesubscriptions/2877816481
     *
     * It is suggested to unsubscribe from Person models
     * after it does not need them. The Person model cannot do this itself, because
     * in JavaScript there is no concept of "finalizers" or "destructors" and so
     * the Person model cannot know when it's no longer needed.
     */
    export interface Person {
        /** SIP URI of this person. i.e. "sip:johndoe@contoso.com" */
        id: Property<string>;

        displayName: Property<string>;
        
        title: Property<string>;
        
        office: Property<string>;
        
        department: Property<string>;
        
        company: Property<string>;

        /** This may either be a remote URL to a PNG or a JPEG picture
            or a data URL with embedded picture data. */
        avatarUrl: Property<string>;

        /** Sorted by type. */
        phoneNumbers: Collection<PhoneNumber>;

        /** All email addresses. */
        emails: Collection<Email>;
        
        status: Status;

        /** 
         * The custom user-defined activity text augments the online status value.
         * 
         * It is encoded in UTF-16 and in the locale specified during application 
         * creation. The value of this string is localized in the current 
         * application's culture provided the localized string exists in the 
         * contact's publication. 
         * 
         * Otherwise, the value of this string is one of the well known activity 
         * strings in which case the application is responsible for the 
         * localization. The well known ones are: 
         * 
         *  "in-a-meeting",              (user has an accepted meeting)
         *  "urgent-interruptions-only", (busy)
         *  "on-the-phone",              (speaking with one person)   
         *  "in-a-conference",           (speaking with more than one person) 
         *  "off-work", 
         *  "out-of-office",
         *  "presenting". 
         */
        activity: Property<string>;

        /** When the status is 'Away' this indicates when the person was 
         * last available 
         */
        lastSeenAt: Property<Date>;

        /** The device type on which the contact has been the most active. */
        endpointType: Property<EndpointType>;

        /**
         * var note = person.note; // get the note object
         * note.text.subscribe(); // subscribe to changes of note.text
         * note.text.changed((t) => {
         *     console.log("new note is " + t);
         * });
         */
        note: Note;

        /**
         * var location = person.location(); // read the location
         * person.location.subscribe(); // subscribe to location changes
         * person.location.changed((location) => {
         *     console.log("new location is " + location);
         * });
         */
        location: Location;

        /**
         * Like note, the capabilities is not a property, but an object 
         * containing the following sub-properties (all of which contain boolean 
         * flags indicating whether the person is capable of communicating using 
         * certain modalities):
         *
         *      var modalities = person.capabilities;
         *      if (!modalities.audio())
         *          console.log("audio not supported");
         *
         * Since capabilities is not a property itself, it can not 
         * be subscribed to; but its sub-properties can be subscribed to:
         *
         *      // get capabilities object
         *      var modalities = person.capabilities;
         *      // subscribe to changes of capabilities.audio
         *      modalities.audio.subscribe(); 
         *      modalities.audio.changed((f) => {
         *          console.log("audio modality is " + f ? 
         *              'supported' : 'not supported');
         *      });
         */
        capabilities: Capabilities;
    }

    /** 
     * Represents the signed-in user.
     *
     * Essentially, this object is a person object with the ability to change 
     * certain properties. It must be noted that the user may be signed on 
     * multiple endpoints and all these endpoints may be sending simultaneous 
     * requests to change the online status, change the note text and so on. 
     * The server aggregates these requests and notifies all the endpoints of 
     * the aggregated user state change. 
     */
    export interface MePerson extends Person {
    }
}