
# Versioning
UCWA interfaces uses link-relations to express capabilities supported by the server and client to discover those capabilities - this is in line with HATEOAS (Hypertext as the engine of application state) principle. New capabilities can be introduced by adding new link-relations, but there will be times when the UCWA platform will have to extend existing link-relations with additional semantics without breaking backward compatibility.


 _**Applies to:** Skype for Business 2015_




## Versioning Rules

UCWA follows particular rules to help a client discover when an existing link-relation is revised with additional properties/semantics so that latest client can take advantage of the latest features, and also to recognize when the latest client is talking to an older server.


### Scheme

UCWA versioning scheme exists to allow each link-relation/Resource to evolve (version) independently with following rules:


- The UCWA server will use 'revision' attribute to indicate the version of REL/Resource available: `<link rel="contacts" revision="2" />`
 
- Lack of revision attribute will imply `version=1` (i.e. the first version when the REL/resource was introduced)
 
- All subsequent revisions of a REL/resource will be backward compatible.
 
- REL/Resource reference documentation will indicate list of supported query-parameters/properties and expected behavior for each REL/resource revision
 

```HTML
<!-- No revision attribute means it's the first version -->
<link rel="Contacts" href="/ucwa/v1/Applications/Contacts" />
<!-- The revisions have been made to REL 'contacts'; backward compatible with revision '1' -->
<link rel="Contacts" revision="2" href="/ucwa/v1/Applications/Contacts" />
<!-- The revisions have been made to REL 'contacts'; backward compatible with revisions '1' &amp; '2' -->
<link rel="Contacts" revision="3" href="/ucwa/v1/Applications/Contacts" />
```


## Version Targeting

If theUCWA client is looking to implement/consume a particular version (for example, '3') of a REL (for example, 'Contacts') then the client MUST do all of the following:


- The client must validate the capability is available by checking if `<link rel="Contacts" />` is present
 
- Link-revision attribute is greater than or equal to (>=) desired-REL-version (in this case '3')
 
- The client should use float (instead of integer) to compare revision-versions even if the server is giving revision in integer-form. This is for future extensibility.
 
 When submitting a request to the server, the client can explicitly specify the version of resource-input (query-parameter and/or property) with HTTP header `'X-MS-RequiresMinResourceVersion'`, to ensure the server understands the client's request and behaves as expected per requested version.
 
 Not specifying the version header may cause problems, as the client would expect the server understood query-parameters when, in fact, the server just ignored it, especially if failover occurred to an older version of server.
 
 If the server can't honor the client's requested version of the resource, the server will reject the request with `404: {Code=NotFound &amp; SubCode=APIVersionNotSupported}`
 
 Example of a server unable to honor the client's requested version of REL/Resource:
 


 ```HTML
 ===>
GET /example.com/autodiscover/user
Accept: application/vnd.microsoft.ucwa+xml
<===
200 OK
Content-Type: application/vnd.microsoft.ucwa+xml
X-MS-UcwaVersion: 1.7
<resource>
<link rel="application" rev="4" href="http://example.com/ucwa/v1/applications" />
</resource>
===>
POST /ucwa/v1/applications
Accept: application/vnd.microsoft.ucwa+xml
X-MS-RequiresMinResourceVersion: 4.0
<input-with-parameters-known-only-by-revision-4 (x, y, z)>
<===
404 Not Found
Content-Type: application/vnd.microsoft.ucwa+xml
<code>NotFound</code>
<subcode>APIVersionNotSupported</subcode>
 ```

Resources that are extended with properties as part of subsequent revisions will return the latest version of resource supported by the server, regardless of the client's requested version. The client is expected to handle unknown properties and play back the full resource representation with a `PUT` request.

All UCWA responses include the header named `'X-MS-UcwaVersion'` that identifies the resource-revision that the server served for a given request.

