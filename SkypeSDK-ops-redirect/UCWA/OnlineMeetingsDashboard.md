
# Online meetings dashboard
The **onlineMeetings** resource acts as a dashboard that represents the ability of a user to create and manage online meetings.


 _**Applies to:** Skype for Business 2015_


Users can create and manage online meetings in Skype for Business by using the [onlineMeetings](onlineMeetings_ref.md) resource. This is the dashboard to view, schedule and manage online meetings.

## Resource representation
<a name="sectionSection0"> </a>

The following table contains a representation of the **onlineMeetings** resource.


**Property bag**
  ```
  "rel" : "onlineMeetings"
  ```

 **Links**
```
"self" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings"
},
"myAssignedOnlineMeeting" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/myOnlineMeetings/714"
},
"myOnlineMeetings" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/myOnlineMeetings"
},
"onlineMeetingDefaultValues" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/onlineMeetingDefaultValues"
},
"onlineMeetingEligibleValues" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/onlineMeetingEligibleValues"
},
"onlineMeetingInvitationCustomization" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/onlineMeetingInvitationCustomization"
},
"onlineMeetingPolicies" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/onlineMeetingPolicies"
},
"phoneDialInInformation" : {
 "href" : "/ucwa/v1/applications/878/onlineMeetings/phoneDialInInformation"
}

```


Every online meeting is considered a private meeting. Only those who know the coordinates of this meeting can join. Every user also has an assigned meeting, known as the public meeting, if the deployment supports it. The public meeting is per user and the coordinates never change. If the user uses the public meeting to schedule an online meeting, anyone who has the coordinates can step into this meeting at any time. Every online meeting includes several kinds of information such as the ID, subject, description, access level, leader assignment, expiry date, lobbyByPass settings, meeting URI, and so on.


## myOnlineMeetings
<a name="sectionSection1"> </a>

The [myOnlineMeetings](myOnlineMeetings_ref.md) resource can be used to create a new online meeting as well as to modify or delete an existing online meeting.


## myAssignedOnlineMeeting
<a name="sectionSection2"> </a>

The client can send a GET request on the [myAssignedOnlineMeeting](myAssignedOnlineMeeting_ref.md) resource to get the public meeting that is created by default in the Skype for Business store if the deployment supported it. By default this is displayed to the user when she chooses to create an online meeting.


## onlineMeetingDefaultValues
<a name="sectionSection3"> </a>

Use the [onlineMeetingDefaultValues](onlineMeetingDefaultValues_ref.md) resource to represent the default values for various properties of a meeting. This set of default values is used by the application to provide a meaningful UI to the user when an online meeting is created.


## onlineMeetingEligibleValues
<a name="sectionSection4"> </a>

Use the [onlineMeetingEligibleValues](onlineMeetingEligibleValues_ref.md) resource to represent the set of allowed values that certain properties can have in a meeting. This set of values is used by the application to provide a meaningful UI to the user when an online meeting is created.


## onlineMeetingPolicies
<a name="sectionSection5"> </a>

Use the [onlineMeetingPolicies](onlineMeetingPolicies_ref.md) resource to set and get the policies used to create and manage meetings. Before scheduling a meeting, a client is expected to retrieve and honor these policies. If a client schedules a meeting that violates these policies, the scheduling request can fail. To get the current policies, send a GET request on the **onlineMeetingPolicies** resource.


## phoneDialInInformation
<a name="sectionSection6"> </a>

Use the [phoneDialInInformation](phoneDialInInformation_ref.md) resource to retrieve local telephone number information that is helpful for attendees to know about available numbers based on their region. The client provides the local telephone number in the UI presented to the user.


## onlineMeetingInvitationCustomization
<a name="sectionSection7"> </a>

Use the [onlineMeetingInvitationCustomization](onlineMeetingInvitationCustomization_ref.md) resource to get data that can be used to customize a meeting for the particular company. This includes properties such as the company help URL, company logo, meeting invitation footer, and others.

