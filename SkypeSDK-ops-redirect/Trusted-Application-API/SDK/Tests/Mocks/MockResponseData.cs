using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;

namespace Microsoft.SfB.PlatformService.SDK.Tests
{
    internal class MockResponseData
    {
        public List<ResourceData> ResponseData { get; set; }

        public ResourceData FindResponse(Uri uri, HttpMethod method)
        {
            foreach(ResourceData response in ResponseData)
            {
                if(response.Uri == uri && response.Method == method.Method)
                {
                    return response;
                }
            }

            return null;
        }
    }

    internal class ResourceData
    {
        public Uri Uri { get; set; }

        public string Method { get; set; }

        public HttpStatusCode ResponseCode { get; set; }

        public string Content { get; set; }

        public Dictionary<string, string> Headers { get; set; }
    }
}
