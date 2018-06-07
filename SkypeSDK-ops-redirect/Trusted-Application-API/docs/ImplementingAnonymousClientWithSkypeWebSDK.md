# Implementing a Anonymous Client with the Skype Web SDK

This article will discuss the flow for _Anonymous Meeting Join_ involving the client-side functionality
of the Skype Web SDK.  

The anonymous user can join into Skype meetings by using a meeting's URI. For Skype for Business Online,
_Anonymous Meeting Join_ is supported through the **Trusted Application API**. The meeting's URL is passed to the Service Application, which talks to the Trusted 
Application API and enables anonymous users to join the online meeting.



## Prerequisites

1. Obtain a _meeting URL_ by scheduling an online meeting 
by using the Skype for Business Client or Outlook, or even programmatically using 
UCWA or the **Trusted Application API**. Please read [Anonymous Meeting Scheduling](./AnonymousMeetingSchedule.md) for details. 

2. Develop **Trusted Application API** Service Applications for Skype for Business Online. Please read [ Developing **Trusted Application API** applications for Skype for Business Online](./AADS2S.md) for details.

3. Bootstrap your web application to work with Skype Web SDK. Please read [Bootstrapping the application Section](https://msdn.microsoft.com/en-us/skype/websdk/docs/gettingstarted#sectionSection2) for details.

## Code Walkthrough

#### 1. Get anonymous application token

When the user decides to join the meeting, it pings the Service Application with the meeting's url.
The user gets the _anonymous application token_ based on the _meeting URL_(should be in same tenant).

```
/* POST Request on "https://metiobank.cloudapp.net/GetAnonTokenJob".
 GetAnonTokenJob is the Service Application API that gets Token 
and Discovery Uri with meetingUrl.
*/ 

$.ajax({
        url: https://metiobank.cloudapp.net/GetAnonTokenJob,
        type: ‘post’,
        dataType: ‘text’,
        data: {
                ApplicationSessionId: [guid()],
                AllowedOrigins: [window.skypeWebApp.allowedOrigins] ,
                MeetingUrl: [meetingurl]
            }; 
});  

// Response data:

{
  “DiscoverUri”:”**”,
  “ExpireTime”:”**”,
  “TenantEndpointId”:”**”,
 “Token”:”” 
 }
```
#### 2. Sign in to the Web SDK using the Anonymous Token and Discover URL in your sign-in parameters.
Sign in to the Web SDK using the following parameters and code:

```
// Payload to sign in from Web SDK:
                    anonmeetingsignin = {
                        name: '[AnonUser]',
                        cors: true,
                        root: { user: [DiscoverUri from above] },
                        auth: function (req, send) {
                            if (req.url != user)
                                req.headers['Authorization'] = "Bearer " + [Token from above];
 
                            return send(req);
                        }
                    };
        skypeWebApp.signInManager.signIn(anonmeetingsignin);
```

#### 3. Get the conversation
The following client side JavaScript example queries the Web SDK conversation manager's
collection of active conversations. The conversation at index 0 directly gives us the active conversation.

```
 client.conversationsManager.conversations(0)
```


