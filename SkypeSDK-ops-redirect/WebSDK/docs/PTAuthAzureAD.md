# Authentication using Azure Active Directory (AAD)

 _**Applies to:** Skype for Business 2015_

Getting OAuth correct is not an easy task, but this guide will try to break it down into a series of clear steps. First, we need to create users who will be authorized for this online application (more information can be found at: <a href="//azure.microsoft.com/en-us/documentation/articles/active-directory-create-users/" target="">Create or edit users in Azure AD</a>).
Next, we create an application in the portal and add delegate permissions for Skype for Business Online and provide a Reply URL.  The exact URL can be found below, so feel free to copy it when creating your application in the Azure Portal.  Next, in order to enable the OAuth 2.0 Implicit Grant flow we need to manually edit the application manifest.  Check out <a href="//azure.microsoft.com/en-us/documentation/articles/active-directory-integrating-applications/" target="">Integrating Applications with Azure Active Directory</a> and look for the section about **Enabling OAuth 2.0 Implicit Grant for Single Page Applications** for detailed instructions on how to do this.

Once that application is created we should now have a Client ID that we can use for sign-in by redirecting for authorization. Upon succesful sign-in, the authorization page should redirect back to the main application page, except it will add a hash value to the URL. This framework has code built-in to handle checking for this value and completing sign-in.
        
It is advised to not be logged into multiple MSA accounts when testing out OAuth because multiple users will confuse the sign-in process preventing proper authentication. For best results consider running in your browser's private mode if available.

## Provide a client id to sign-in

1. Provide a client id to sign-in.

  ```js
    window.sessionStorage.setItem('client_id', client_id);
    var href = 'https://login.microsoftonline.com/common/oauth2/authorize?response_type=token&client_id=';
    href += client_id + '&resource=https://webdir.online.lync.com&redirect_uri=' + window.location.href;
    window.location.href = href;
  ```

## Detailed Setup Instructions
-  <a href="//msdn.microsoft.com/skype/websdk/docs/developwebsdkappsforsfbonline" target="">Developing Web SDK applications for Skype for Business Online</a>

## Related Resources
- <a href="//azure.microsoft.com/en-us/documentation/articles/active-directory-integrating-applications/" target="">Integrating Applications with Azure Active Directory</a>
- <a href="//azure.microsoft.com/en-us/documentation/articles/active-directory-authentication-scenarios/" target="">Active Directory Authentication Scenarios</a>