
# Communication dashboard
The **communication** resource acts as a dashboard for the various abilities of the user to communication with others.


 _**Applies to:** Skype for Business 2015_

The [communication](communication_ref.md) resource gives the user the ability to communicate with other users. This can be via telephone, starting or joining an online meeting, or peer-to-peer messaging. The user can also specify supported incoming modalities and the message format (plain or HTML) she would like to support while communicating with other users.

## Resource representation
<a name="sectionSection0"> </a>

The following table contains a representation of the communication resource.


**Property bag**
```
"rel" : "communication",
"phoneNumber" : "tel:+14255552222",
"supportedMessageFormats" : [
 "Plain",
 "Html"
],
"supportedModalities" : [
 "PhoneAudio",
 "Messaging"
],
```


**Links**
```
"self" : {
 "href" : "/ucwa/v1/applications/878/communication"
},
"conversations" : {
 "href" : "/ucwa/v1/applications/878/communication/conversations"
},
"joinOnlineMeeting" : {
 "href" : "/ucwa/v1/applications/878/communication/joinOnlineMeeting"
},
"startMessaging" : {
 "href" : "/ucwa/v1/applications/878/communication/startMessaging"
},
"startOnlineMeeting" : {
 "href" : "/ucwa/v1/applications/878/communication/startOnlineMeeting"
},
"startPhoneAudio" : {
 "href" : "/ucwa/v1/applications/878/communication/startPhoneAudio"
}
```



## conversations
<a name="sectionSection1"> </a>

A [conversations](conversations_ref.md) resource represents the user's ongoing conversations.


### conversation

The **conversations** resource represents a collection of [conversation](conversation_ref.md) resources, each with information about a particular conversation. This information can be in the form of all the active modalities present in a conversation, conversation state at a given point of time (for example: Conferenced, Connected, Incoming, or In-Lobby), the number of participants in the conversation and so on. Users can get information about the local and remote participants participating in a conversation, and data about adding or deleting different modalities in the conversation.


### participants

Participants are those who are taking part in a conversation. A [participant](participant_ref.md) resource gives the application author information about members of the conversation. This allows us to distinguish participants by source network; helps us to identify if users are anonymous participants; if they are local or remote; and to identify organizers and provide contact information that will allow the organizers to communicate with conversation participants outside the conversation.

Users can determine which active modalities the local and remote participants are involved in, and can perform various operations such as admitting participants into a conversation, denying entry to participants who are waiting in the lobby, demoting participants to attendees, promoting participants to leaders, and ejecting participants from a conversation.


## conversationLogs
<a name="sectionSection2"> </a>

The **conversationLogs** resource serves as a kind of dashboard that represents the history of conversations the user has had as a collection of **conversationLog** resources.

A [conversationLogs](conversationLogs_ref.md) resource represents a collection of [conversationLog](conversationLog_ref.md) resources.


### Resource Representation

The following table contains a representation of the **conversationLogs** resource.


**Property bag**
```
"rel": "conversationLogs"
```


**Links**
```
"self": {
 "href": "/ucwa/v1/applications/405/communication/conversationLogs"
},
"conversationLog": {
 "href": "/ucwa/v1/applications/405/communication/conversationLogs/conversationLog"
}
```



## joinOnlineMeeting
<a name="sectionSection3"> </a>

The [joinOnlineMeeting](joinOnlineMeeting_ref.md) resource enables a user to joins an online meeting.


## startMessaging
<a name="sectionSection4"> </a>

The [startMessaging](startMessaging_ref.md) resource starts a [messagingInvitation](messagingInvitation_ref.md) that adds the [messaging](messaging_ref.md) modality to a new conversation.


## startOnlineMeeting
<a name="sectionSection5"> </a>

The [startOnlineMeeting](startOnlineMeeting_ref.md) resource creates and joins an _ad hoc_multiparty conversation.


## startPhoneAudio
<a name="sectionSection6"> </a>

The [startPhoneAudio](startPhoneAudio_ref.md) resource initiates a call-via-work by starting a [phoneAudioInvitation](phoneAudioInvitation_ref.md) that adds the [phoneAudio](phoneAudio_ref.md) modality to a new conversation.

