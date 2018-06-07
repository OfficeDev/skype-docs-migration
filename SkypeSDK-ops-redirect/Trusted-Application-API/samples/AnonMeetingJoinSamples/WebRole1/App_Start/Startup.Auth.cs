using System.Collections.Generic;
using Owin;
using Microsoft.Azure;
using Microsoft.Owin.Security.ActiveDirectory;
using System.IdentityModel.Tokens;

namespace Microsoft.SfB.PlatformService.SDK.Samples.FrontEnd
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            string audienceUri = CloudConfigurationManager.GetSetting("AudienceUri");

            app.UseWindowsAzureActiveDirectoryBearerAuthentication(new WindowsAzureActiveDirectoryBearerAuthenticationOptions
            {
                MetadataAddress = CloudConfigurationManager.GetSetting("AAD_MetadataUri"),
                TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidAudiences = new List<string> { audienceUri }
                }
            });
        }
    }
}
