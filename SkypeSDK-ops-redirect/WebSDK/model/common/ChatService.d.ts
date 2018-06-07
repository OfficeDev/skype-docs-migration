/// <reference path="pm.d.ts" />
/// <reference path="ConversationEnums.d.ts" />
/// <reference path="ConversationService.d.ts" />

declare module jCafe {
    
    /** Starting chat service on a conversation added to the collection:
     *
     *       client.conversationsManager.conversations.added((conversation) => {
     *           conversation.chatService.start();
     *       });
     *
     *   Accepting a chat invite on a conversation:
     *
     *       conversation.selfParticipant.chat.state.when('Notified', () => {
     *           var name = conversation.participants(0).person.displayName();
     *           var chatService = conversation.chatService;
     *
     *           if (chatService.accept.enabled() && 
     *              confirm('Accept incoming chat request from ' + name + '?')) {
     *               console.log('accepting the incoming chat request');
     *               chatService.accept();
     *           } else {
     *               console.log('declining the incoming chat request');
     *               chatService.reject();
     *           }
     *       });
     */
    export interface ChatService extends ConversationService {

        /** Use this to determine the type of MessageFormats supported for both 
         *  outgoing and incoming messages in the conversation
         */
        supportedMessageFormats: Collection<MessageFormat>;

        /** Use to send a message of any format and the message is converted to 
         *    the supported format.
         *    This API can be used to continue a disconnected conversation. 
         *
         *   Starting a multiparty conversation and sending a message:
         *
         *       var conversation = app.conversationsManager.createConversation();
         *       var remoteParty = conversation.createParticipant(remotePerson);
         *       conversation.chatService.start().then(() => {
         *           conversation.sendMessage('Hi there!', 'Text');
         *       });
         *
         *   Accept invite and send message:
         *
         *       client.conversationsManager.conversations.added(conversation => {
         *       if (conversation.chatService.accept.enabled())
         *             conversation.chatService.accept().then(() => {
         *                   conversation.chatService.sendMessage('Got your invite');
         *             });
         *       });
         */
        sendMessage: Command<(text: string, format?: MessageFormat) => Promise<void>>;

        /** 
         * Notifies the server that the user is typing a message.
         *
         * This method needs to be called periodically since the server resets 
         * the typing status of the participant after a few seconds and the client 
         * doesn't know when the status is reset.
         * Typically this happens after 5-6 seconds. A possible way to invoke this method:
         *
         *     var input = document.querySelector('input');
         *     var typing = false;
         *
         *     input.onkeydown = () => {
         *         if (!typing) {
         *             messaging.sendIsTyping();
         *             typing = true;
         *             setTimeout(() => {
         *                 typing = false;
         *             }, 1500);
         *         }
         *     };
         *
         * This implementation sends the typing notification every 1.5 seconds 
         * while the user is typing.
         * A typical mistake in implementing such UI is to send the notification 
         * every time the user hits a keystroke.
         */
        sendIsTyping: Command<() => Promise<void>>;
    }
}