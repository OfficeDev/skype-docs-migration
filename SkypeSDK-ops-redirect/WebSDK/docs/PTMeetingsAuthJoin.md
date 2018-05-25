## Prerequisites
- Bootstrap Skype Web SDK
- Sign-In

## Permissions

For Skype for Business Online application, you will need the following permission(s):
- Initiate Real time conversations and join meetings

### Provide a conference URI to join a meeting.
        
The application object exposes a conversationsManager object which we can use to get meeting conversations by calling getConversationByUri(...) and providing an online meeting URI.  After creation of the conversation object, it is helpful to setup a few event listeners for added participants and when we disconnect from the conversation.  In this example we demonstrate connecting to video so we also need to know when we are connected to video as well as any added participants.

After the conversation and video modality are established we can begin communicating with the remote parties.  When finished click the end button to terminate the conversation.