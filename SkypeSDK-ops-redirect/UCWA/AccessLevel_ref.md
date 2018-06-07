
# AccessLevel


_** Applies to: **Skype for Business 2015_

Represents the access levels used to control access to an online meeting.
            

The access level defines which users are immediately admitted into the online meeting
without being placed into the lobby. An online meeting organizer or leader
can select specific types of user to bypass the online meeting lobby (see the LobbyBypassForPhoneUsers 
enumeration). However, users other than the organizer are always placed in the lobby if the online meeting access level
was set to AccessLevel.Locked.
            
## Members



|**Name**|**Description**|
|:-----|:-----|
|Everyone|Everyone is admitted into the online meeting.|
|Invited|Only invited participants from the same company are admitted into the online meeting.All other participants are placed in the online meeting lobby.|
|Locked|Only the organizer is admitted into the online meeting.All other participants are placed in the online meeting lobby.|
|None|Not initialized.|
|SameEnterprise|Only the participants from the same company are admitted into the online meeting.All other participants are placed in the online meeting lobby.|
