
# P2P Chat Conversation Escalation


 _**Applies to:** Skype for Business 2015_

## Escalating a P2P Chat Conversation

The application object exposes a conversationsManager object which we can use to create new conversations by calling getConversation(...) and providing a SIP URI.  After creation of the conversation object it is helpful to setup a few event listeners for when we are connected to chat, added participants, added messages, and when we disconnect from the conversation.  We can use the chatService on the conversation object and call start() to initate the call and send an invitation.

We can use the participants collection of the conversation and call add(...) providing a SIP URI to invite additional persons.  They will receive an invitation and if they accept will be added to the conversation.  In the case of a peer-to-peer, P2P, conversation the server will escalate it to a conference.

After the conversation and chat modality are established messages events will be triggered when either the remote party or the local send a message.  When finished click the end button to terminate the conversation.

### Escalate a P2P conversation

1. Initiate a conversation with a person and start chat

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
    conversation.chatService.start().then(null, function (error) {
        // handle error
    });
  ```

2. Add participant to the established P2P conversation

    ```js
    var id = content.querySelector('.id2').value;
    conversation.participants.add(id).then(function () {
        // participant successfully added
    }, function (error) {
        // handle error
    });
    ```

3. Send messages to the group

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
