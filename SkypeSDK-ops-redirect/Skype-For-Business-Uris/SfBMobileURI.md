# Skype for Business - Mobile URIs
Skype for Business Mobile URIs provide a simple way for you to initiate calls and chats using the Skype for Business mobile clients from websites and other apps.

For a Mobile URI to work, the Skype for Business mobile app must be installed on the user’s device, and the user must have an active account. The most recent versions of Skype for Business iOS and Android support Mobile URIs. All interaction initiated by these Mobile URIs happens through the Skype for Business app.

Currently two-party chat, and audio calls can be initiated by Mobile URIs on Skype for Business iOS and Android. There is also a URI to launch the app.  Skype for Business Android additionally supports Mobile URI initiating video calls.

## General Syntax
A ms-sfb URI has the following general form: `"ms-sfb://" [operation] ["?" query ]`

The components are: 
- `operation = call / chat`
- `query =   [ "?" *(term "=" condition ) ]`
  - `term = 1*ALPHA`
  - `condition = 1*ALPHA`

>Note: If required parameters are missing or have invalid values, a 400 (bad request error) will be returned. Any additional/unknown parameters will be ignored.

## Operations

| Operation        | Syntax           | Parameters | Supported Apps  |
| ------------- |:-------------|:-----|:-----|
| Launch app     | `ms-sfb://start` | None | iOS, Android |
| Start call     | `ms-sfb://call?id=(sip address) [&video= false or true ] `|`id` -   required parameter, can be an email address or PSTN ("+" (DIGIT) *(DIGIT / "-" )).  `video` - optional Boolean parameter with default of false, used to indicate that the user prefers the call as a video call, will be audio only if video not possible |  iOS (audio only), Android |
| Start chat | `ms-sfb://chat?id=(sip address)  URLEncoded(url)`|id -   required parameter, can be an email address or a URL encoded [SIP URI](https://msdn.microsoft.com/en-us/library/office/hh347488(v=office.14).aspx) | iOS, Android|

###URI Examples

Start a chat:
- "ms-sfb://chat?url=user%40contoso.com"
- "ms-sfb://chat?id=user@contoso.com"

Start a call:
- "ms-sfb://call?id=+1425-555-1234"
- "ms-sfb://call?id=user@contoso.com"

Start a video call (Android only):
- "ms-sfb://call?id=user@contoso.com&video=true"

## Mobile platform examples

Read the following topics for examples of how to implement the Skype for Business Mobile URIs in Java for Android and Swift for iOS.

* [Start a Skype call from an Android mobile device](AndroidCall.md)

##Mobile URI SDK Samples

You can find Android samples for this SDK in our [GitHub repository](https://github.com/OfficeDev/Skype-for-Business-Android-Uri-Sample) today. 
Check back later for iOS samples.

