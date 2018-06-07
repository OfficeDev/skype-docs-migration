# startPhoneAudioOnBehalfOfDelegator

 _**Applies to:** Skype for Business 2015_


Initiates a call-via-work on behalf of the delegator.
             

## Web Link
<a name = "sectionSection0"> </a>

For more on web links, see [Web links](WebLinks.md).


|**Name**|**Description**|
|:-----|:-----|
|rel|The resource that this link points to. In JSON, this is the outer container.|
|href|The location of this resource on the server, and the target of an HTTP operation.|

## Resource description
<a name = "sectionSection1"> </a>

startPhoneAudioOnBehalfOfDelegator allows a user to create a new peer-to-peer [conversation](conversation_ref.md) with a [contact](contact_ref.md) using call-via-work.A call-via-work call is an outgoing call that is initiated from a user's phone, and that displays the user's Skype for Business work identity to the remote party.A [phoneAudioInvitation](phoneAudioInvitation_ref.md) will be started; its status can be tracked on the event channel.

### Properties



None

### Links



None

### Azure Active Directory scopes for online applications



The user must have at least one of these scopes for operations on the resource to be allowed.
|**Scope**|**Permission**|**Description**|
|:-----|:-----|:-----|
|Conversations.Initiate|Initiate conversations and join meetings|Allows the app to initiate instant messages, audio, video, and desktop sharing conversations; and join meetings on-behalf of the signed-in user|
|Conversations.Receive|Receive conversation invites|Allows the app to receive instant messages, audio, video, and desktop sharing invitations on-behalf of the signed-in user|

## Operations



<a name="sectionSection2"></a>

### POST




Starts a [phoneAudioInvitation](phoneAudioInvitation_ref.md) and creates a new conversation with a contact.

#### Request body




|**Name**|**Description**|**Required?**|
|:-----|:-----|:-----|
|operationId|The ID that the application supplies to correlate its request with the corresponding operation started in the event channel.The maximum length is 50 characters. String|No|
|phoneNumber|The user's own telephone number that she wants to ring when using [startPhoneAudio](startPhoneAudio_ref.md).The input parameter is a digit string that can include "+" if the following digit string is an E.164 normalized number.This parameter is optional and defaults to the phone number supplied when the application was created.String|No|
|importance|The conversation's importance ([Importance](Importance_ref.md)): Normal, Urgent, or Emergency.An application can use this as a hint to inform the user.(Importance)Normal, Urgent, or Emergency|No|
|subject|The conversation's subject.The property has a maximum length of 250 characters.The maximum length is 250 characters. String|No|
|threadId|The conversation's thread ID.An application can use this ID to continue an existing conversation.String|No|
|to|The [contact](contact_ref.md) that this invitation is to be sent to.String|Yes|
|customContent|CustomContent passing with invitationExternalResource|No|
|delegator|Sets the delegator when initiating a call on behalf of delegator.String|No|

#### Response body



|**Item**|**Description**|
|:-----|:-----|
|[phoneAudioInvitation](PhoneAudioInvitation_ref.md)|Represents an invitation to a [conversation](conversation_ref.md) for the [phoneAudio](phoneAudio_ref.md) modality.|

#### Synchronous errors



The errors below (if any) are specific to this resource. Generic errors that can apply to any resource are covered in [Generic synchronous errors](GenericSynchronousErrors.md).

|**Error**|**Code**|**Subcode**|**Description**|
|:-----|:-----|:-----|:-----|
|ServiceFailure|500|CallbackChannelError|The remote event channel is not reachable|
|Conflict|409|AlreadyExists|The already exists error.|
|Conflict|409|TooManyGroups|The too many groups error.|
|Conflict|409|None|Un-supported Service/Resource/API error.|
|Gone|410|CannotRedirect|Cannot redirect since there is no back up pool configured.|

#### Examples




#### JSON Request




```
Post https://fe1.contoso.com:443/ucwa/v1/applications/192/communication/startPhoneAudioOnBehalfOfDelegator HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com
Content-Type: application/json
Content-Length: 322
{
  &quot;operationId&quot; : &quot;74cb7404e0a247d5a2d4eb0376a47dbf&quot;,
  &quot;phoneNumber&quot; : &quot;tel : +14255551234&quot;,
  &quot;importance&quot; : &quot;Normal&quot;,
  &quot;subject&quot; : &quot;SkypeforBusiness&quot;,
  &quot;threadId&quot; : &quot;292e0aaef36c426a97757f43dda19d06&quot;,
  &quot;to&quot; : &quot;sip : john@contoso.com&quot;,
  &quot;delegator&quot; : &quot;samplevalue&quot;,
  &quot;_links&quot; : {
    &quot;customContent&quot; : {
      &quot;href&quot; : &quot;data : text/plain;base64,
      somebase64encodedmessage&quot;
    }
  }
}
```


#### JSON Response



This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.
```
HTTP/1.1 201 Created
Location: /ucwa/v1/applications/192/communication/invitations/146

```


#### XML Request




```
Post https://fe1.contoso.com:443/ucwa/v1/applications/192/communication/startPhoneAudioOnBehalfOfDelegator HTTP/1.1
Authorization: Bearer cwt=PHNhbWw6QXNzZXJ0aW9uIHhtbG5...uZm8
Host: fe1.contoso.com
Content-Type: application/xml
Content-Length: 503
&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;
&lt;input xmlns=&quot;http://schemas.microsoft.com/rtc/2012/03/ucwa&quot;&gt;
  &lt;property name=&quot;operationId&quot;&gt;74cb7404e0a247d5a2d4eb0376a47dbf&lt;/property&gt;
  &lt;property name=&quot;phoneNumber&quot;&gt;tel:+14255551234&lt;/property&gt;
  &lt;property name=&quot;importance&quot;&gt;Urgent&lt;/property&gt;
  &lt;property name=&quot;subject&quot;&gt;Skype for Business&lt;/property&gt;
  &lt;property name=&quot;threadId&quot;&gt;292e0aaef36c426a97757f43dda19d06&lt;/property&gt;
  &lt;property name=&quot;to&quot;&gt;sip:john@contoso.com&lt;/property&gt;
  &lt;property name=&quot;delegator&quot;&gt;samplevalue&lt;/property&gt;
&lt;/input&gt;
```


#### XML Response



This sample is given only as an illustration of response syntax. The semantic content is not guaranteed to correspond to a valid scenario.
```
HTTP/1.1 201 Created
Location: /ucwa/v1/applications/192/communication/invitations/146

```


