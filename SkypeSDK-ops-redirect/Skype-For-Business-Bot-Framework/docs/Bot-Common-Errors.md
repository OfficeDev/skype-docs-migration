# Skype for Business Bot - Common Errors

>Note: The Skype for Business Bot Framework channel is in Developer Preview.

This article lists the most common errors encountered during the Skype for Business Bot setup and what you can do to solve them.

 
1\. **New-CsOnlineApplicationEndpoint cmdlet** related errors are outlined in the following table.

|Error|Resolution|
|:---|:---|
|**+ FullyQualifiedErrorId : Error processing cmdlet request**<br> "type":"Microsoft.Skype.EnterpriseVoice.CbdService.DataAccess.**EntityNotFoundException**"|Add a Url for CallbackUri in the messaging Url field in botframework properties|
|**+ FullyQualifiedErrorId : Could not get application endpoint or the Uri is already<br> present as an User in BVD**|Delete the existing user account with the same sipuri in tenant or run the cmdlet using a sipuri that does not already exist in tenant|
|**+ FullyQualifiedErrorId : Error processing cmdlet request**<br> "message":"Validation failed on entity"<br> "type":"System.ArgumentException" <br>"message":"SipUri cannot be NULL or Empty and it has be lowercase" <br>"type":"System.ComponentModel.DataAnnotations.ValidationException"|This error is caused when  *New-CsOnlineApplicationEndpoint* -Uri sip parameter value has uppercase characters. Use all lowercase for -Uri sip parameter|
|**+ FullyQualifiedErrorId : Error processing cmdlet request**<br>"type":"Microsoft.Rtc.Management.Hosted.PlatformService.ProvisioningLibrary.<br> ApplicationEndpointProvisioningException was thrown."|This error is caused by timing issues in the provisioning. Sometimes this error is also seen with *Set-CsOnlineApplicationEndpoint -Uri*, although the issue resolves itself after a few minutes.<br>Run *Set-CsOnlineApplicationEndpoint -Uri  <app@domain.com>* followed by *Get-CsOnlineApplication -Uri <app@domain.com>*to verify that there are no issues.|
|**+ FullyQualifiedErrorId : Error processing cmdlet**<br>**+ FullyQualifiedErrorId : {"odata.error":{"code":"Request_BadRequest","message":{"lang":"en","value":"Property immutableId is invalid."}**|This error is caused by running cmdlet on a hybrid topology with a federated domain. Workaround is to use a non-federated domain.|
|Processing data from remote server failed with the following error message: The user 'usera@contoso.com' does not have permission to manage this tenant.|To add your bot to Skype for Business, you must sign-in as the Tenant Administrator of a Skype for Business Online environment. See [About the Skype for Business admin role](https://support.office.com/en-us/article/About-the-Skype-for-Business-admin-role-aeb35bda-93fc-49b1-ac2c-c74fbeb737b5) for details.|
|||

 2\. **Other common errors are as follows:**

|Error|Resolution|
|:-|:-|
|There was an error sending the message to your bot. HTTP status code Gateway Timeout|SFB can only callback to 443 port for external urls. SFB does not allow other ports for security reasons. Set the bot callback to listen on 443 port|
|In a federation/multi-tenant scenario, external users are unable to contact the BOT|Skype for Business Bots can only communicate to users in the same domain/tenant. In most cases, it is recommended a bot “instance” be created in each domain/tenant.|
|Skype for Business Bot Presence appears as "Unknown"|The Bot Framework Skype for Business Channel is in Developer Preview and does not support presence at the current time.|
|Skype for Business Bot display picture is not set|The Bot Framework Skype for Business Channel is in Developer Preview and does not support bot display pictures at the current time.|
 
 
 
 
 
 
 
 
 
