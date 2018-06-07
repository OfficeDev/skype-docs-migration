
# Start a conversation


 _**Applies to:** Skype for Business 2015_

The following procedure assumes that the user is signed in and has a person to communicate with.


### Starting a peer-to-peer conversation


1. Call the [ConversationsManager.getConversation](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.conversationsmanager.html#getconversation) method, with a person for the only argument, to create a conversation object.
    
2. Call the  **start** method on the desired modality to add the modality and start the conversation. See the following topics to add modalities:
    
    [Send and receive text in a conversation](SendReceiveText.md)  
    
    [Add or remove audio in a conversation](AddRemoveConversationAudio.md)  
    
    [Add or remove video in a conversation](AddRemoveConversationVideo.md)  
    
The following example creates a peer-to-peer conversation. 


```js
// create a conversation model
var person = somePerson; // this somePerson can be obtained via search or from persons list
var conversation = conversationsManager.getConversation(person);
// start modality

```


### Starting a multiparty conversation (ad-hoc meeting)


1. Call the [ConversationsManager.createConversation](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.conversationsmanager.html#createconversation) method, with no arguments, to create a multiparty conversation object. This conversation will be a multiparty conversation regardless of the number of participants in the conversation.
    
2. Call the  **start** method on the desired modality to add the modality and start the conversation.
    
The following example creates a peer-to-peer conversation. 



```js
// create a multiparty conversation model
var conversation = conversationsManager.createConversation();
// start modality

```


### Escalating a peer-to-peer conversation to a multiparty conversation


A peer-to-peer conversation will be automatically escalated to a multiparty conversation when a second remote participant is added to the conversation. See [Add participants to a conversation](AddParticipants.md) to add participants.
    
