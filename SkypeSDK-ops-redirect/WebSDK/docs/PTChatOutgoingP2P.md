
# Outgoing P2P Chat Conversation


 _**Applies to:** Skype for Business 2015_

## Sending a message in a conversation

The application object exposes a conversationsManager object which we can use to create new conversations by calling getConversation(...) and providing a SIP URI.

After creation of the conversation object it is helpful to setup a few event listeners. The conversation object exposes a selfParticipant object which we can use to get access to modalities and in this example we are interested in chat.
The chat modality exposes a state property which we can attach a listener for changed to know when we are connected to the conversation.

The conversation object exposes a participants collection which we can attach a listener for added to know when new people are added to the conversation.

The conversation object exposes a chatService object that we can use to get access to a messages collection which we can attach a listener for added to know when news messages have been received.
The conversation object exposes a state property which we can subscribe via when(...) to know when we are disconnected from the conversation.

The chatService object exposes a method, sendMessage(...), to facilitate sending messages. In this example we do not have chat established in the conversation so an invitation will be created and sent containing the supplied message.

After the conversation and chat modality are established messages events will be triggered when either the remote party or the local send a message. When finished click the end button to terminate the conversation.


### Send a message

1. Initiate a conversation with a person 

  ```js
    var id = content.querySelector('.id').value;
    var conversationsManager = application.conversationsManager;
    conversation = conversationsManager.getConversation(id);
    listeners.push(conversation.selfParticipant.chat.state.when('Connected', function () {
        // Connected to chat
    }));
    listeners.push(conversation.participants.added(function (person) {
        // person.displayName() has joined the conversation
    }));
    listeners.push(conversation.chatService.messages.added(function (item) {
        // logMessage(item)
    }));
    listeners.push(conversation.state.changed(function (newValue, reason, oldValue) {
        if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
            // conversation ended
        }
    }));
  ```

2. Send an outgoing message

  ```js
    var message = content.querySelector('.messageToSend');
    conversation.chatService.sendMessage(message.value).then(function () {
        // message send success
    }, function (error) {
        // handle error
    });
  ```

3. End the conversation

  ```js
    conversation.leave().then(function () {
        // conversation ended
    }, function (error) {
        // handle error
    }).then(function () {
        // clean up operations
    });
  ```
