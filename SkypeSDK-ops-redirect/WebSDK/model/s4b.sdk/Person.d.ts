declare module jCafe {
    /** 
     * The location model is also a string property with
     * the basic textual representation of the location.
     */
    export interface Location extends Property<string> {
    }

    export interface MePerson {
        /** Alias to the first email address in the emails collection. */
        email: Property<string>;

        /** 
         * Performing a reset on this tells the server to pick the most 
         * appropriate value for note
         */
        note: Note & { reset(): Promise<void> };
        /** 
         * Performing a reset on this tells the server to pick the most 
         * appropriate value for status
         */
        status: Status & { reset(): Promise<void> };
        /** 
         * Performing a reset on this tells the server to pick the most 
         * appropriate value for location
         */
        location: Location & { reset(): Promise<void> };
    }
}