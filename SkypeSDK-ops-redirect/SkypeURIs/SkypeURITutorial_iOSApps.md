
# Skype URI tutorial: iOS apps

Learn how to incorporate Skype communication functionality into your iOS apps.


 _**Applies to:** Skype_

 >**Note:**  With the recent redesign of the Skype for iOS client, URIs are not currently supported on the Skype for iOS 5. _x_ branch.


## Use Skype URIs in your iOS apps

You can use Skype URIs in your iOS apps; for example, tapping a contact's picture might start a Skype audio call. After 
you have constructed the appropriate Skype URI, simply use  **openURL** to initiate its actions.

```
- (IBAction)skypeMe:(id)sender
{
  BOOL installed = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"skype:"]];
  if(installed)
  {
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"skype:echo123?call"]];
  }
  else
  {
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://itunes.com/apps/skype/skype"]];
  }
}

```


## Determine whether a Skype client is installed

Your iOS app can simply pass the  **skype:** scheme to **canOpenURL** to determine whether a Skype client is installed 
on the device. A return value of **true** indicates that the Skype client is installed.


## What to do if a Skype client is not installed

If the Skype client is not installed, your app should alert the user, and direct them to the App Store. Ideally, your app 
should use **openURL** with the argument value: `http://itunes.com/apps/skype/skype` to navigate directly to the Skype 
for iPhone/iPad install page.


## Additional resources


* [Skype URIs](SkypeURIs.md)
* [Skype URI API reference](SkypeURIAPIReference.md)
* [Skype URIs: Branding guidelines](SkypeURIs_BrandingGuidelines.md)
* [Skype URIs: FAQs](SkypeURIs_FAQs.md)
* [Skype URI tutorial: Windows 8 apps](SkypeURITutorial_Windows8Apps.md)
* [Skype URI tutorial: Email](SkypeURITutorial_Email.md)
* [Skype URI tutorial: Webpages](SkypeURItutorial_Webpages.md)
* [Skype URI tutorial: Android apps](SkypeURITutorial_AndroidApps.md)
