# Get a Skype for Business on-premise meeting URL
If you have not written a server-side feature to schedule a meeting and return a new meeting URL, you can still get a meeting URL and develop against a live meeting. Users of your production app will rely on server logic to return a new meeting whenever they use the join meeting feature of the **App SDK**.

>[!NOTE]
Production apps must use the generally available App SDK binaries. However, if you are prototyping an app or previewing new features of the App SDK, then you
can enable the preview features of the App SDK by calling the [enablePreviewFeatures](https://ucwa.skype.com/reference/appSDK/Android/com/microsoft/office/sfb/appsdk/ConfigurationManager.html#enablePreviewFeatures()) API method. Doing this allows you
to use the tasks described in this article to join a meeting hosted in a Skype for Business Online server.


## While developing your app
While your app is in development, you can create your own anonymous Skype for Business meeting as long as you are a licensed user of Skype for Business. There are two easy ways to do this.

* Start an ad-hoc meeting from your **Skype for Business** desktop client as shown in figure 1. 

  ![Meet Now button on the Skype for Business client](images/meetnow.PNG "Figure 1. Meet Now button on the Skype for Business client")

* Schedule a **Skype for Business** meeting in outlook. You can set the meeting to run for multiple
days so that you don't need to get a new meeting URL whenever you are testing your code.

 ![Schedule a meeting in Outlook](images/outlookmeeting.PNG "Figure 2. Schedule a meeting in Outlook")
 
* Be sure to check the options for the new meeting are what you want, particularly the lobby options.

  ![Set meeting options](images/meetingoptions.PNG "Figure 3. set meeting options")


                                                                                 
### Get the meeting URL
 
 Join the meeting you scheduled in the previous step. The **Skype for Business** meeting window has a  round "..." button at the 
 bottom right corner of the window. Click the button and choose the **Meeting Entry Info** option from the 
 context menu. The dialog that opens shows a **Meeting Link** field which contains the URL that you'll use to join the
 meeting.  
 
 ![Get the meeting URL from the meeting window](images/entryinfo.PNG "Figure 4. Get the meeting URL from the meeting window")
 
 
 
## In production for Skype for Business Online
 
 To create new meetings on demand and send the new meeting URL to your mobile app, you'll 
 write a Trusted Application API-based server application that makes server-to-server REST calls into an Office 365 **Skype for Business Online** service
 to create a meeting and get the meeting URL. You will need to write a client-side feature to
 communicate with your server application to initiate this transaction and get the
 returned meeting URL. See [Implementing a Anonymous Client with the Skype App SDK](../Trusted-Application-API/docs/ImplementingAnonymousClientWithSkypeAppSDK.md) to learn about adding client side features to an 
 Android or iOS mobile device application.
 
 See [Anonymous Meeting Scheduling](../Trusted-Application-API/docs/AnonymousMeetingSchedule.md) to learn about scheduling a meeting using the Trusted Application API and obtaining a "joinUrl".
 
 
## Use the meeting URL in your app
 
 Once you have the meeting URL string, create an **URI** and provide it to the API. The following snippets show this for the Android and iOS platforms:

- In Java for Android:   ``` conversation = mApplication.joinMeetingAnonymously(getString(R.string.userDisplayName), meetingURI);```

- In Objective C for iOS: ```SfBConversation *conversation = [sfb joinMeetingAnonymousWithUri:[NSURL URLWithString:meetingURLString]displayName:meetingDisplayNameerror:&error];```

