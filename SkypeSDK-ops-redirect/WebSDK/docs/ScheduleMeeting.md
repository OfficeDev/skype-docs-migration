
# Scheduling an online meeting


 _**Applies to:** Skype for Business 2015_

The SDK lets your app schedule online meetings. The meeting your code creates can be joined from the time it is created until the specified expiration date.
Scheduling an online meeting involves creating a client-side model of a future online meeting, setting properties on the model, and then POSTing the model to a server-side UCWA endpoint. 
Once your code POSTs the model, a user can join the meeting. If you have provisioned the meeting with a list of attendees, you must make the joinUri or OnlineMeetingUri available
to the attendees so that they can join. 

>Note: The scheduled meeting is a Skype-only meeting. It is not visible in or available to join from a user's Outlook calendar.


## Meeting properties
All of the properties of an online meeting are optional. However, you should set the following properties:

* [Subject](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html#subject)
* [Expiration time](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html#expirationtime)
* [Access level](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html#accesslevel). The access level determines the set of people who can join the meeting. The [AccessLevel](../../ucwa/AccessLevel_ref.md) values are 
enumerated in the UCWA 2.0 SDK.
* [Attendees](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html#attendees). Set this property if the access level specified is 'Invited'

## Schedule the meeting

The following steps schedule an online meeting with a subject and expiration time.

1. Create a new online meeting and store the returned [scheduledMeeting](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html) object. 
This is still a client side operation and returns a model containing observable properties.

  ```js
  var meeting = app.conversationsManager.createMeeting();
  ```

2. Set properties of the meeting if required. All parameters are optional.
  >Note:  Meeting property values can only be set or updated before the meeting model is POSTed to the UCWA server endpoint. 
  Set any desired properties before you get the onlineMeetingUri and join the meeting.

  ```js
  meeting.subject('Planning meeting');
  meeting.expirationTime(new Date + 24 * 3600 * 5);
  ```

3. Call the [get()](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html#onlinemeetinguri) method on the [onlineMeetingUri](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.scheduledmeeting.html#onlinemeetinguri) 
to create the meeting on the server.

  ```js
  meeting.onlineMeetingUri.get().then(uri => {
      var conversation = app.conversationsManager.getConversationByUri(uri);
  });
  ```

4. [Join the online meeting](https://msdn.microsoft.com/skype/websdk/joinmeeting) by using the [conversation](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.conversation.html) returned in the previous step.
