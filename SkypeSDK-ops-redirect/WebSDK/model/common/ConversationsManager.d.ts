/// <reference path="Conversation.d.ts" />
/// <reference path="SearchQuery.d.ts" />

declare module jCafe {
    
    export interface ConversationsManager {
        /** 
         * Here is a correct way to accept incoming IM invitations:
         *
         *     client.conversationsManager.conversations.added(conversation => {
         *         var chat = conversation.chatService;
         *         if (chat.accept.enabled())
         *             chat.accept();
         *     });
         *
         * The only way to remove a conversation from the collection is
         * to invoke the `remove` method which stops the conversation and
         * then removes it from the collection:
         *
         *     var cv = client.conversationsManager.conversations(5);
         *     client.conversationsManager.conversations.remove(cv).catch(err => {
         *         console.log("Failed to remove the conversation: " + err);
         *     });
         *
         * If the conversation gets stopped because it was terminated on the remote
         * side or because all participants left, the conversation
         * object stays in the collection, but its state changes to "Disconnected".
         *
         * To remove all conversations that get disconnected, use the following
         * pattern:
         *
         *     client.conversationsManager.conversations.added(cv => {
         *         cv.state.once('Disconnected', () => {
         *             client.conversationsManager.conversations.remove(cv);
         *         });
         *     });
         */
        conversations: Collection<Conversation>;

        /** To search for conversations create the search query, set search 
         * terms on the query object and execute the query's search method.
         *
         * var searchQuery = client.conversationsManager.createSearchQuery();
         * searchQuery.text("scrum planning");
         * searchQuery.keywords['participant'] = 'frank';
         * searchQuery.getMore().then(() => {
         *     searchQuery.results().forEach((r) => {
         *         console.log("conversation  uri:", r.result.id());
         *     });
         * });
         */
        createSearchQuery(): SearchQuery<Conversation>;

        /**
         * Creates a new multiparty conversation model.
         *
         * The created conversation model represents a new multiparty 
         * conversation (meeting).
         * To start the conversation add participants (optionally) and start 
         * one of the conversation services. If no participants are added, 
         * the model represents a meeting that is joined by the local participant only.
         * This method adds the created conversation to the conversations collection.
         *
         *     var conversation = app.conversationsManager.createConversation();
         *     var remoteParty = conversation.createParticipant(remotePerson);
         *     conversation.participants.add(remoteParty);
         *     conversation.chatService.start().then(() => {
         *         console.log("chat started");
         *     });
         *      
         */
        createConversation(): Conversation;

        /**
         * Finds an existing 1:1 conversation model or creates a new one.
         *
         * This method finds or creates a conversation with a given Person. 
         * Our API allows multiple 1:1 conversations with the same person, 
         * so while looking for an existing conversation we simply pick the 
         * first one found among such ongoing conversations. We ignore 
         * disconnected (ended) conversations that may still linger in the
         * conversations collection. This method adds the newly created 
         * conversation to the conversations collection.
         */
        getConversation(person: Person): Conversation;

        /**
         * Finds an existing multiparty conversation model or creates a new one.
         *
         * A conversation uri has a meaning only for a multiparty conversation 
         * - it is a meeting uri.
         * A conversation model with such a uri represents the client's view 
         * of this meeting. Note that initially such a model is just an empty 
         * conversation model which has a non-null uri property; the client joins 
         * the meeting only when one of the conversation services is started. 
         * This method adds the newly created conversation to the conversations 
         * collection.
         */
        getConversationByUri(uri: string): Conversation;

        /** 
         *  Fetch the next batch of conversations after the latest item downloaded by the client.
         *
         *  This method can be used for scrolling through recent conversations history.
         *  Note that conversations are received in order how they were updated.
         *  Conversations already received by previous calls will not be received again.
         *  Command will be disabled when there are no more conversation on server available. 
         */
        getMoreConversations: Command<(count?: number) => Promise<void>>;

        unreadConversationsCount: Property<number>;
    }
}