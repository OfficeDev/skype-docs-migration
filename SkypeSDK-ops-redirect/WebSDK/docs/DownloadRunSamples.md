
# Downloading and running the Skype Web SDK samples



 _**Applies to:** Skype for Business 2015_

 **In this article**  
[Downloading and setting up the samples](#sectionSection0)  
[Samples in the download package](#sectionSection1)  
[Additional Resources](#bk_addresources)


The Microsoft Skype Web SDK includes a set of web application samples that allow you to run and observe the features of the SDK, such as sign-in, sending instant messages, searching for contacts and distribution groups, using audio/video, and so on.

## Downloading and setting up the samples
<a name="sectionSection0"> </a>

You can run the Microsoft Skype Web SDK samples against your private Skype for Business Server 2015 installation or [Skype for Business Online](DevelopWebSDKappsForSfBOnline.md).


1. Download the samples files. The Microsoft Skype Web SDK samples are available on github in our GitHub [Skype Web SDK Samples](https://github.com/OfficeDev/skype-docs/tree/master/Skype/WebSDK) directory.
    
2. Copy the samples files to a local folder on your computer such as C:\websites\skype-docs.

3. Go to the 'C:\websites\skype-docs\Skype\WebSDK' folder on your computer, and run 'npm install'. 

4. Go to the 'C:\websites\skype-docs\Skype\WebSDK\build' folder on your computer, and run 'Build-Samples.ps1'. (You can run 'Build-Samples.ps1 -watch' for live compilation)

5. Start the project with IIS or your favorite web server, with 'C:\websites\skype-docs\Skype\WebSDK' as the root of your project.
   
6. Instructions to start project with IIS:
 - To install IIS, go to  **Control Panel**, click  **Turn Windows features on and off**, then select  **IIS**
 - From  **Start**, run  **IIS Manager**. Right-click on  **Sites**, choose  **Add Website**, and add a new website called SkypeWebSDKSamples. Set the location to the 'C:\websites\skype-docs\Skype\WebSDK' on your computer. Stop  **Default Web Site**, then start  **SkypeWebSDKSamples**.   


7. Open your browser in private mode and go to http://localhost. You should see the "Skype Web SDK Interactive Samples" website.
    
8. Sign in using any one of the authentication modes from under the **Authentication** section on the left side menu, to start running the Samples. 
    

## Samples in the download package
<a name="sectionSection1"> </a>

The Microsoft Skype Web SDK samples are available on github at [Skype Web SDK Samples](https://github.com/OfficeDev/skype-docs/tree/master/Skype/WebSDK).


 >**Note**  To enable audio/video functionality, clients must install the Skype for Business Web App Plug-in. It is available for Windows and Mac computers from the following download locations:
 - [Windows Download](https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeMeetingsApp.msi)
 - [Mac Download](https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeForBusinessPlugin.pkg)


|||
|:-----|:-----|
|**Sample**|**Description**|
|Authentication|Demonstrates the different modes of authentication. Allows the user to sign in using any of these modes, as well as to sign out.|
|Local User|Demonstrates the different operations one can perform on the currently signed in user. Allows the user to change note, location, and presence state.|
|Contacts|Demonstrates the different operations one can perform on the contacts of the currently signed in user. Allows the user to search for contacts and distribution groups.|
|Groups|Demonstrates the different operations one can perform on the groups and contacts of the currently signed in user. Allows the user to search, add and remove groups, as well as adding or removing a contact from a group.|
|Chat|Demonstrates the different operations one can perform on chat conversations. Allows the user to start, accept, or escalate a P2P chat, as well as start a group chat.|
|Audio|Demonstrates the different operations one can perform on audio conversations. Allows the user to start or accept P2P or PSTN conversations, as well as start group audio conversations or escalate P2P audio. Allows the user to also hold, resume, and mute conversations. Allows the user to perform Phone Audio and Call Transfer as well.|
|Video|Demonstrates the different operations one can perform on video conversations. Allows the user to start, accept, or escalate a P2P video conversations, as well as start a group video conversation. Allows the user to also add video to an existing audio conversation.|
|History|Demonstartes the different operations one can perform with the history service. Allows the user to retrieve conversations and chat history for each conversation.|
|UI Controls|Demonstartes the use of Skype Conversation Control UI. Allows the user to create multiple conversation controls.|
|Devices Manager|Demonstrates the different operations one can perform with the devicesManager API. Allows the user to set selected speaker, microphone and camera.|

## Additional Resources
<a name="bk_addresources"> </a>


- [Skype Web SDK](SkypeWebSDK.md)
    
- [UCWA: Code](https://ucwa.skype.com/code)
    
- [UCWA: Interactive Samples](https://ucwa.skype.com/websdk)
    
