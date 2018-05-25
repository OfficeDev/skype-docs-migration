# Registering a Trusted Application in Skype for Business Online

Each Trusted Application must be registered against the Skype for Business Online Platform Service.  There are two registration steps for a Trusted Application against Skype for Business Online:

1. Registration of the Trusted Application: this step is completed by the ISV or Developer

2. Registration of the Trusted Application Endpoint: this step is completed by the end Customer (Tenant Admin)


Each registration step has an appropriate UI or Powershell script to perform registration. 


## Register a Trusted Application 

As a developer, to register your Service Application in Skype for Business Online, you must use the [quick registration tool](https://aka.ms/skypeappregistration).

Log in using your O365 credentials and follow the steps to register your application.  The portal quickly allows you to register either:

   - An existing application you have already registered in Azure Active Directory following [Registration in Azure Active Directory](./RegistrationInAzureActiveDirectory.md)

   - A brand new application that does not exist in Azure Active Directory.  The registration portal will conveniently register your app in Azure as well as Skype for Business, so that you do not need to access the Azure portal directly.

Registration values:

   - **Name of your application:**  This is the friendly name of your app.
      
   - **App ID URI:** The URI used as a unique logical identifier for your app. The URI must be in a verified custom domain for an external user to grant your app access to their data in Windows Azure AD. For example, if your Microsoft tenant is contoso.onmicrosoft.com, the APP ID URI could be https://app.contoso.onmicrosoft.com. The URL must be https.  
   
   - **Callback URI:**  This is the URI where your application will receive POST events from Skype for Business.  Example: https://mytrustedapp.contoso.com/callback
   
   - **Client Secret:** This is provided by the registration portal for authentication.
   
   
## Register Tenant-specific Trusted Application Endpoint   
   
In order for a customer tenant to use your application (or for your own devlopment and testing), a Skype for Business tenant admin must:

   1. Provide tenant admin consent for your app, using the Azure Active Directory consent screen.  A tenant administrator must explicitly grant consent to allow your application to access tenant data. The consent process is a browser-based experience that requires the tenant admin to sign into the Azure AD consent UI and review the access permissions that your application is requesting, and then grant or deny the request.  Refer to [Tenant Admin Consent](./TenantAdminConsent.md) for more details.
   
   2. Register a tenant-specific Trusted Application Endpoint for your app using Skype for Business Admin Powershell. The [full instructions](./TrustedApplicationEndpoint.md) give you more information about this step.

## Register Tenant-specific Trusted Application endpoints with Skype for Business Online.
A tenant administrator must explicitly grant consent to allow your application to access tenant data using the **Trusted Application API**s. The consent process is a browser-based experience that requires the tenant admin to sign into the Azure AD consent UI and review the access permissions that your application is requesting, and then grant or deny the request. You need the following information to complete the endpoint registration.


- **Application Id, AppID uri** from step 2 in the previous section.

- A **name** of your application within Skype for Business Online

- The **Tenant ID** GUID of the tenant where you are registering a trusted application endpoint.  Available from the Azure portal Azure Active Directory properties page.

- **Sip Uri** that identifies the tenant specific endpoint for the application. Requests sent to this endpoint will trigger the **Trusted Application API** sending an event to the application, indicating that someone has sent a request.

- **Callback uri** for the **Trusted Application API** to POST events to the application

### Additional information
Read about [Skype for Business Online Scope Permissions](https://msdn.microsoft.com/en-us/skype/ucwa/skypeforbusinessonlinescopepermissions) to learn more about permissions.  

See [Tenant Admin Consent](./TenantAdminConsent.md) and the following for additional information:
[Building Service Apps in Office 365](https://msdn.microsoft.com/en-us/office/office365/howto/building-service-apps-in-office-365)
