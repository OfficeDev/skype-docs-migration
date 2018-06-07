
# Skype URI tutorial: Android apps

Learn how to incorporate Skype communication functionality into your Android apps.

 _**Applies to:** Skype_

## Use Skype URIs in my Android apps

You can use Skype URIs in your Android apps, for example, tapping a contact's picture might start a Skype audio call. 
After you have constructed the appropriate Skype URI, use an Android **Intent** to initiate its actions.

Keep in mind these two important points regarding the Skype for Android client:


* Component package name— **com.skype.raider**
* Component class name— **com.skype.raider.Main**

```java
/**
 * Initiate the actions encoded in the specified URI.
 */
public void initiateSkypeUri(Context myContext, String mySkypeUri) {

  // Make sure the Skype for Android client is installed.
  if (!isSkypeClientInstalled(myContext)) {
    goToMarket(myContext);
    return;
  }

  // Create the Intent from our Skype URI.
  Uri skypeUri = Uri.parse(mySkypeUri);
  Intent myIntent = new Intent(Intent.ACTION_VIEW, skypeUri);

  // Restrict the Intent to being handled by the Skype for Android client only.
  myIntent.setComponent(new ComponentName("com.skype.raider", "com.skype.raider.Main"));
  myIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

  // Initiate the Intent. It should never fail because you've already established the
  // presence of its handler (although there is an extremely minute window where that
  // handler can go away).
  myContext.startActivity(myIntent);

  return;
}

```


## Determine if a Skype client is installed

Your Android app can use the  **PackageManager.getPackageInfo** method to determine whether a Skype client is installed 
on the device.

```java
/**
 * Determine whether the Skype for Android client is installed on this device.
 */
public boolean isSkypeClientInstalled(Context myContext) {
  PackageManager myPackageMgr = myContext.getPackageManager();
  try {
    myPackageMgr.getPackageInfo("com.skype.raider", PackageManager.GET_ACTIVITIES);
  }
  catch (PackageManager.NameNotFoundException e) {
    return (false);
  }
  return (true);
}
```


## What to do if a Skype client is not installed

If the Skype client is not installed, your app should alert the user, and direct them to the Android Market or 
Google PlayStore. Ideally, your app should use a **market:** scheme **Intent** to navigate directly to the Skype 
for Android install page.


```java
/**
 * Install the Skype client through the market: URI scheme.
 */
public void goToMarket(Context myContext) {
  Uri marketUri = Uri.parse("market://details?id=com.skype.raider");
  Intent myIntent = new Intent(Intent.ACTION_VIEW, marketUri);
  myIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  myContext.startActivity(myIntent);

  return;
}

```


## Additional resources


* [Skype URIs](SkypeURIs.md)
* [Skype URI API reference](SkypeURIAPIReference.md)
* [Skype URIs: Branding guidelines](SkypeURIs_BrandingGuidelines.md)
* [Skype URIs: FAQs](SkypeURIs_FAQs.md)
* [Skype URI tutorial: Windows 8 apps](SkypeURITutorial_Windows8Apps.md)
* [Skype URI tutorial: Email](SkypeURITutorial_Email.md)
* [Skype URI tutorial: Webpages](SkypeURItutorial_Webpages.md)
* [Skype URI tutorial: iOS apps](SkypeURITutorial_iOSApps.md)
