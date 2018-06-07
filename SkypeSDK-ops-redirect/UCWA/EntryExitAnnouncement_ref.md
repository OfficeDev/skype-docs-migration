
# EntryExitAnnouncement


_** Applies to: **Skype for Business 2015_

Represents the different states for attendance announcements in an online meeting.
            

When attendance announcements are enabled, the online meeting will announce the names
of the participants who join the meeting through audio.
            
An application should set this property to EntryExitAnnouncement.Enabled
only if the online meeting supports modifying the attendance announcements status. 
            
## Members



|**Name**|**Description**|
|:-----|:-----|
|Disabled|Attendance announcements are disabled.|
|Enabled|Attendance announcements are enabled.|
|Unsupported|The online meeting does not support modifying attendance announcements.Server versions prior to Microsoft Lync Server 2010 do not supportthe modification of attendance announcements.|
