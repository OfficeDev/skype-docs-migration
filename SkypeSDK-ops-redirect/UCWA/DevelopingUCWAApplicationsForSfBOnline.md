
# Developing UCWA applications for Skype for Business Online
 Learn how to develop UCWA 2.0 online web applications.



 >Note: This topic does not apply to on-premises or hybrid server scenarios; only online scenarios.


UCWA uses Azure Active Directory (Azure AD) to provide authentication services that your application can use to obtain rights to access the service APIs. To accomplish this, your application needs to perform the following steps:


1. Register your application in Azure AD. To allow your application access to the UCWA 2.0 APIs, you need to register your application in Azure AD. This will allow you to establish an identity for your application and specify the permission levels it needs in order to access the APIs. For details, see [Registering your application in Azure AD](RegisteringYourApplicationInAzureAD.md).
 
2. Obtain tenant admin consent, using scope permissions. A tenant admin must explicitly grant consent to allow your application to access tenant data by means of the UCWA APIs. The consent process is a browser-based experience that requires the tenant admin to log into the Azure AD consent UI and review the access permissions that your application is requesting, and then grant or deny the request. After consent is granted, the UI redirects the user back to your application. For details, see [Skype for Business Online scope permissions](SkypeForBusinessOnlineScopePermissions.md).
 
3. Sign in. When a user visits your website and initiates sign-in, your application makes a request to the Azure AD authorization endpoint. Azure AD validates the request and responds with a sign-in page, where the user signs in. If authentication is successful, Azure AD returns cookies that identify the current signed-in user. For details on sign-in, see [Authentication using Azure AD](AuthenticationUsingAzureAD.md).
 
4. Perform autodiscovery. Skype for Business services are distributed, so servers running in different pools respond to requests. To determine which UCWA home pool serves the authenticated user, your application makes a request to the UCWA 2.0 autodiscovery service. For details on autodiscovery, see [Authentication using Azure AD](AuthenticationUsingAzureAD.md).
 
5. Request an access token using Oauth2 implicit grant flow. Your application gets an authorization URL based on the user's authentication. Using the authorization URL, your application requests an access token from Azure AD, which your application needs in order to access Skype for Business resources. For details, see [Authentication using Azure AD](AuthenticationUsingAzureAD.md).
 
6. Call the UCWA 2.0 APIs. Your application passes access tokens to the UCWA 2.0 APIs to authenticate and authorize your application.
 
If you intend to develop an UCWA 2.0 Online web application, you should first read the topics in this section.

## In this section


- [Registering your application in Azure AD](RegisteringYourApplicationInAzureAD.md)
 
- [Authentication using Azure AD](AuthenticationUsingAzureAD.md)
 
- [Skype for Business Online scope permissions](SkypeForBusinessOnlineScopePermissions.md)
 
The following topics also apply to the UCWA 2.0 Online web application workflow:


- [Event channel details](EventChannelDetails.md)
 
- [Batching requests](BatchingRequests.md)
 
- [Web links](WebLinks.md)
 
