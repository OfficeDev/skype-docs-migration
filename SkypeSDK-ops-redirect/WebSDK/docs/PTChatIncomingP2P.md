
# Incoming P2P Chat Conversation


 _**Applies to:** Skype for Business 2015_

## Receiving a message in a conversation

The application object exposes a conversationsManager object that exposes a conversations collection which we can attach an event listener for added to be notified when new invitations for conversations arrive.  When a conversation is added we can add an event listener for when the chatService object accept command is enabled which means that this conversation would be for chat.  We also should listen for when we disconnect from the conversation.

When the accept command is enabled we can choose to either accept the invitation or reject via respective commands and in this example it is handled via confirm(...).  In the case of accepting the invitation, we should add event listeners for added participants and messages.

After the conversation and chat modality are established messages events will be triggered when either the remote party or the local send a message.  When finished click the end button to terminate the conversation.

### Receive a message

1. Listen for incoming conversations 

  ```js
    var conversationsManager = application.conversationsManager;
    listeners.push(conversationsManager.conversations.added(function (conv) {
        conversation = conv;
        listeners.push(conversation.chatService.accept.enabled.when(true, function () {
            // showModal('Accept incoming chat invitation?');
            if (USER_ACCEPT_INCOMING_CHAT) {
                conversation.chatService.accept();
                listeners.push(conversation.participants.added(function (person) {
                    // person.displayName() has joined the conversation
                }));
                listeners.push(conversation.chatService.messages.added(function (item) {
                    // handle incoming message
                }));
            }
            else {
                conversation.chatService.reject();
            }
        }));
    }));
  ```

2. Listen for converstation state changes

 ```js
    listeners.push(conversation.state.changed(function (newValue, reason, oldValue) {
        if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
            // conversation ended
        }
    }));
  ```
3. Send an outgoing message

  ```js
    var message = content.querySelector('.messageToSend');
    conversation.chatService.sendMessage(message.value).then(function () {
        // message send success
    }, function (error) {
        // handle error
    });
  ```

4. End the conversation

  ```js
    conversation.leave().then(function () {
        // conversation ended
    }, function (error) {
        // handle error
    }).then(function () {
        // clean up operations
    });
  ```
