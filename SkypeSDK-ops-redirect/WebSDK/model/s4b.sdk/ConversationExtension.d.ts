declare module jCafe {
    /**
     * An extension to the conversation that serves as an opaque communication channel
     * with an external service
     */
    export interface ConversationExtension {
        /** Data sent by the service to the client through this extension */
        content: Property<any>;

        /**
         * The type of the content property as specified by the service 
         * The sdk does not infer the type from the content, it simply passes
         * along what is provided to it
         */
        contentType: Property<string>;

        /** The name of the service communicating through this extension */
        serviceName: Property<string>;

        /**
         * A channel for the client to communicate back to the service.
         * @param content Any content in a string format. The SDK just passes it along.
         * @param contentType A mime type identifying the type of content. Non standard
         * mime types are acceptable here since the SDK just passes it along.
         * 
         * @returns An object with content and contentType values obtained from the ConversationExtensionResult's 'result' link.
         */
        sendData: Command<(content: string, contentType: string) => Promise<{ content: any, contentType: string }>>;
    }
}