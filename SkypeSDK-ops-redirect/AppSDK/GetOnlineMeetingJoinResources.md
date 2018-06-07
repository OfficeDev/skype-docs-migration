# Get meeting join resources for Skype for Business Online meetings

Joining a Skype for Business Online meeting anonymously requires some additional steps that you don't need to do
for on-premise server hosted meetings. Rather than getting a meeting URL and calling into the [joinMeetingAnonymously](https://ucwa.skype.com/reference/appSDK/Android/com/microsoft/office/sfb/appsdk/Application.html\#joinMeetingAnonymously\(java.lang.String, java.net.URI\)) API method,
you need to get a meeting join URL from a [Trusted Application API](../Trusted-Application-API/docs/Overview.md)-enabled service application. You'll also need a Skype for Business Online server discovery URL and an anonymous meeting join token. 

## Develop a Trusted Application API-based service application

Your mobile app can get the Skype for Business Online resources needed to join a meeting anonymously, but it will need help from the 
service application that you need to create. Your SaaS app must perform the following tasks to enable the anonymous meeting join scenario:

1. Receive a request from your client app to [create an adhoc meeting](../Trusted-Application-API/docs/AnonymousMeetingSchedule.md) and return the meeting join url
   - Pass the meeting join URL to your client app
2.  Receive a request from your client app to [get a discovery URI and an anonymous meeting join token](../Trusted-Application-API/docs/AnonymousMeetingJoin.md).
    - Pass the discovery URI and token to your client app

The [Implementing a Anonymous Client with the Skype App SDK](../Trusted-Application-API/docs/ImplementingAnonymousClientWithSkypeAppSDK.md) article in the **Trusted Application API** SDK documentation shows you how to get the meeting resources necessary to
join an anonymous meeting.

## Next steps

- [Use the SDK to join a meeting with an Android device](HowToJoinMeeting_Android.md)
- [Use the SDK to join a meeting with an iOS device](HowToJoinMeeting_iOS.MD)    
