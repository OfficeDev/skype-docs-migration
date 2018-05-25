
# Core capabilities
Learn about the core features of Microsoft Unified Communications Web API 2.0.


 _**Applies to:** Skype for Business 2015_

## Contacts and Groups Management
<a name="sectionSection0"> </a>

UCWA 2.0 provides API-level access to the contacts and groups that a user can communicate with. The API can be used to view the user's contact list as a simple collection or in groups. UCWA 2.0 supports the ability to add and remove Contacts, User Groups, as well as Distribution Groups from the contact list. Additionally, the API can be used to search for contacts in the user's organization, other federated organizations, even on the Skype network. The API also allows for monitoring of the contact list and for subscribing to the presence of contacts.


## Conversation History and Auto-Accept
<a name="sectionSection1"> </a>

With UCWA 2.0 applications have the ability to view a list of past conversations and continue from an existing thread. In addition, UCWA 2.0 end-points now have the ability to auto-accept the incoming IM invites and messages like any other Skype for Business end-points.


## Two-party and multi-party IM
<a name="sectionSection2"> </a>

UCWA 2.0 supports instant messaging between two parties in a peer-to-peer fashion as well as multi-party IM sessions that are hosted by the server. Multi-party sessions allow participants to come and go without ending the conversation.


## Schedule an online meeting
<a name="sectionSection3"> </a>

UCWA 2.0 can be used to schedule an online meeting that can be joined by this API or other Skype for Business services. Join coordinates can be shared with others, and Microsoft Exchange Server APIs can be used to place this information on the user's calendar.


## Join an online meeting
<a name="sectionSection4"> </a>

UCWA 2.0 allows for the joining of online meetings with messaging and phone audio modalities. A roster of meeting attendees is provided; this information includes participant name, contact information, and modalities.


## Contact card
<a name="sectionSection5"> </a>




### Presence, location, and note

UCWA 2.0 enables a user to both publish and view her presence, location, and note. In the current release, the API supports the standard set of presence states, such as **Online**, **Busy**, and **Away**. Custom presence can only be viewed via this API. Locations are user-provided strings that can be set or displayed for sharing with other contacts. For note, the API supports publishing the personal note and viewing either the personal or out of office note; the selection is driven by the server-side logic and the user's calendar. 

These three pieces of information are viewable for all contacts in the API.


### Phones and call forwarding

UCWA 2.0 allows users to edit their phone numbers that are shown to other users. Additionally, users can control their call forwarding settings, allowing incoming calls to simultaneously ring, go straight to voicemail, or be redirected to another contact. 

Phone numbers for all contacts can be viewed via the API.


### Photo

UCWA 2.0 allows users to view their own photos or the photos of their contacts.


## Phone audio
<a name="sectionSection6"> </a>

Phone audio, or call-via-work, is the ability to ring a user-provided number before connecting him with another contact for voice calls. The other contacts are identified by a URI including phone number, and standard forwarding rules can be followed to reach them.


## Anonymous access
<a name="sectionSection7"> </a>

UCWA 2.0 provides anonymous access to online meetings that are hosted by an authenticated user. This allows individuals from outside the organization or without Skype for Business credentials to join online meetings and communicate with organization members. An online meeting URI is used to route the anonymous user to the correct meeting.

