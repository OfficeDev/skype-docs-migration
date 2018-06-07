using System;
using System.Security.Cryptography.X509Certificates;

namespace Microsoft.SfB.PlatformService.SDK.Common
{
    /// <summary>
    /// Certificate Helper.
    /// </summary>
    public static class CertificateHelper
    {
        /// <summary>
        /// Look for a specified certificate.
        /// </summary>
        /// <param name="x509FindType">The cert find type.</param>
        /// <param name="searchByValue">The value which is used for search.</param>
        /// <param name="storeName">The cert store name.</param>
        /// <param name="storeLocation">The cert store location.</param>
        /// <returns>The X509 Certificate.</returns>
        public static X509Certificate2 LookupCertificate(X509FindType x509FindType, object searchByValue, StoreName storeName, StoreLocation storeLocation)
        {
            if (searchByValue == null)
            {
                throw new ArgumentNullException(nameof(searchByValue), "The parameter named searchByValue can't  be null.");
            }

            var result = default(X509Certificate2);
            var certStore = new X509Store(storeName, storeLocation);

            certStore.Open(OpenFlags.ReadOnly);
            X509Certificate2Collection certCollection = certStore.Certificates.Find(x509FindType, searchByValue, false);
            if (certCollection.Count > 0)
            {
                result = certCollection[0];
            }
            certStore.Close();
            return result;
        }
    }
}
