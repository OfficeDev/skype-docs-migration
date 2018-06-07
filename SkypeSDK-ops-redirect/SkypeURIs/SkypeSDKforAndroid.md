
# Skype SDK for Android

The Skype for Android SDK enables your Android mobile device application to start chat, audio, and video conversations with the Skype client.


 _**Applies to:** Skype_

This SDK works with the **Skype** client for Android but not the **Skype for Business** client for Android. If you want to start **Skype for Business** conversations from an Android device, see [Skype for Business - Mobile URIs](https://msdn.microsoft.com/en-us/skype/skype-for-business-uris/sfbmobileuri).


## What can I do with the Skype for Android SDK?

Help your users get in contact with you by instant message, video or voice call. Use Skype's infrastructure to power your communication.

This SDK will allow you to deep link to a call or instant message chat in the Skype app using an Intent, removing the complexity of building URLs for Intents.


## Using the SDK


### Import the Android SDK from jCenter

Configure your Android project to download project dependencies from  **jcenter**. Add this **Gradle** code to project level _build.gradle_, before the dependencies:


```
repositories { 
    jcenter() 
} 
```

Add a dependency on the  **jcenter** hosted **Skype Android SDK**: Add the following **Gradle** code to the app _build.gradle_ file dependencies section where you will use the **Skype** dependency


```
compile 'com.skype.android.skype-android-sdk:MobileSdk:1.0.0.0' 
```


### Call the API

Details of the API and how to call it are described in the [API documentation](https://skypeonramps.github.io/SkypeAndroidMobileSDK/javadoc/index.mdl). The embeddable button will initiate a Skype call to a specific Skype user. To create the button, you need to know the Skype user's  **Skype Name**. In most cases this will be one that you already manage. If you don't know your **Skype Name**, this [guide](https://support.skype.com/en/faq/FA10858/what-s-my-skype-name) will help you find it.

If you want to initiate a call or chat with a bot built with the Microsoft Bot Framework rather than a human  **Skype** user. To do this, get the Microsoft _App ID_ for your bot from your bot page. Once you have this, prefix the Microsoft App ID with '28:'. Pass the modified App ID to the API as the _accountId_. The _accountId_ will be of the format: '28: b4914413-f8dd-4cb3-b2db-9b715ecfe26e'


#### Call a Skype user

Add the following Java code to the callback method for the click event of your Skype button:


```
try { 
    SkypeApi skypeApi = new SkypeApi(getApplicationContext()); 
 
        skypeApi.startConversation(skypeName.toString(), Modality.AudioCall); 
} catch (SkypeSdkException e) { 
 // Exception handling logic here 
} 
```


#### Chat with a Microsoft Bot Framework Bot

Start a chat with a Bot: Add the following code to the callback method for the click event of your Skype button:


```
try {
    SkypeApi skypeApi = new SkypeApi(getApplicationContext());
        //Get the app id of your bot and prepend 28:
        skypeApi.startConversation('28: b4914413-f8dd-4cb3-b2db-9b715ecfe26e', Modality.Chat);
} catch (SkypeSdkException e) {
 // Exception handling logic here
}
```


### Style your Skype button

Your link to the Skype app must follow these [branding guidelines](https://msdn.microsoft.com/library/office/dn745877.aspx).


### Update your Skype privacy settings

You should make sure that the  **Skype Names** that you are using are configured to allow incoming calls and messages from anyone. To change your privacy settings, install **Skype** on a **Windows** computer or Mac. Read about how to change your settings from [Skype for Windows](https://support.skype.com/en/faq/fa140/how-do-i-manage-my-privacy-settings-in-skype-for-windows-desktop) and [Skype for Mac](https://support.skype.com/en/faq/FA10988/how-do-i-manage-my-privacy-settings-in-skype-for-mac-os-x). Depending on the modality you selected, you're likely to have to change your privacy settings to allow either IMs or video from anyone. 


 >**Note:**  By default, Skype is setup not to allow instant messages from people that aren't in your Skype contacts list. If you're using the SDK for instant messaging, we strongly advise you to change your privacy settings.

