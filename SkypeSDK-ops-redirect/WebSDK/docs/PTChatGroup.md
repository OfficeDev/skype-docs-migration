
# Group Conversation


 _**Applies to:** Skype for Business 2015_

## Starting a group conversation

The application object exposes a conversationsManager object which we can use to create new group conversation by calling `createConversation()`.  After creation of the conversation object, it is helpful to setup a few event listeners for when we are connected to chat, added participants, added messages, and when we disconnect from the conversation.

We can add participants to the conversation by calling add(...) providing a SIP URI on the participants collection of the conversation object.  We can use the chatService on the conversation object and call start() to initate the call.

After the conversation and chat modality are established messages events will be triggered when either the remote party or the local send a message.  When finished click the end button to terminate the conversation.

### Start a group conversation

1. Invite participants to group conversation and start chat service

  ```js
    var conversationsManager = application.conversationsManager;
    var id = content.querySelector('.id').value;
    var id2 = content.querySelector('.id2').value;
    conversation = conversationsManager.createConversation();
    listeners.push(conversation.selfParticipant.chat.state.when('Connected', function () {
        // connected to chat
    }));
    listeners.push(conversation.participants.added(function (person) {
        // person.displayName() has joined the conversation
    }));
    listeners.push(conversation.chatService.messages.added(function (item) {
        // handle received message
    }));
    listeners.push(conversation.state.changed(function (newValue, reason, oldValue) {
        if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
            // conversation ended
        }
    }));
    conversation.participants.add(id);
    conversation.participants.add(id2);
    conversation.chatService.start().then(null, function (error) {
        // handle error
    });
  ```

2. Send messages to the group

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
