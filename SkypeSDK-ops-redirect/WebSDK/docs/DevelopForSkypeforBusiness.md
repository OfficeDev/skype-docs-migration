
# Developing Web SDK applications for Skype for Business Server


 _**Applies to:** Skype for Business_

 **In this article**  
[Initialize the Skype application object](#sectionSection0)  
[Password grant authentication](#sectionSection1)  
[Integrated Windows Authentication (IWA)](#sectionSection2)  
[Anonymous meeting join](#sectionSection3)  
[Passive/ADFS authentication](#sectionSection4)  
[OAuth2 authentication](#sectionSection5)  

This section shows how to develop a Skype Web SDK client application for Skype for Business Server.

## Download the SDK and sign in
<a name="sectionSection0"> </a>

Add the following code to the document function of an index page in your app.

```js
Skype.initialize({
  apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255' // SDK preview
}, api => {
  var app = new api.application;
  app.signInManager.signIn(...).then(() => {
    console.log("signed in as", app.personsAndGroupsManager.mePerson.displayName());
  }, err => {
    console.log("cannot sign in", err);
  });
}, err => {
  console.log("cannot download the SDK", err);
});
```

## Password grant authentication
<a name="sectionSection1"> </a>

In the password grant authentication flow, the SDK sends username and password to the server to get a web ticket:

```js
app.signInManager.signIn({
 username: 'user123@contoso.com',
 password: '17Psnds732'
});
```

If no other parameters are provided, the SDK extracts the domain name from the username and attempts to discover UCWA with the two GETs:

- `GET https://lyncdiscover.contoso.com`
- `GET https://lyncdiscoverinternal.contoso.com`

The two URLs are also known as `root` URLs. One of the two servers is supposed to exist and have a valid certificate. If this is not possible, but you know or can discover by other means the `root` URLs, they can be given in the _origins_ parameter:

```js
app.signInManager.signIn({
 username: '****',
 password: '****',
 origins: [
   "https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/root",
   "https://sfbweb2.contoso.com/autodiscover/autodiscoverservice.svc/root"
 ]
});
```

This will tell the SDK to send GETs to these URLs instead:

- `GET https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/root`
- `GET https://sfbweb2.contoso.com/autodiscover/autodiscoverservice.svc/root`

GETs to `root` URLs do not require authentication. A GET to a `root` URL returns a so called `user` URL which does require authentication:

```
GET https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/root

HTTP 200
{ "_links": { "user": { href: "https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/user" } } }
```

If the `user` URL is known beforehand, it can be useful in some cases to start the discovery process from it:

```js
app.signInManager.signIn({
 username: '****',
 password: '****',
 root: { user: "https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/user" }
});
```

The SDK proceeds with a GET to the `user` URL and gets back a `401` response. Most browsers log such responses in the dev console.

```
GET https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/user

HTTP 401
WWW-Authenticate: MsRtcOAuth grant_type="password"
```

The SDK checks that in the 401 response the server says that it supports the password grant auth. Then the SDK sends a POST request with username and password to get a web ticket and resends the GET /user request with the web ticket. The response is supposed to have a so called `applications` URL which is also known as UCWA URL, because this is when the UCWA service is hosted.

```
GET https://sfbweb1.contoso.com/autodiscover/autodiscoverservice.svc/user
Authorization: Bearer cwt=AAB...

HTTP 200
{ "_links": { "user": { href: "https://sfbwebfes0b0m.infra.contoso.com/.../applications" } } }
```

If the `applications` URL is known beforehand, it can be useful in some cases to skip the discovery process and go to that URL directly. This URL usually changes even for the same user.

```js
app.signInManager.signIn({
 username: '****',
 password: '****',
 snapshot: { applications: "https://sfbwebfes0b0m.infra.contoso.com/.../applications" }
});
```

More often than not the `applications` URL belongs to a different domain. This happens because before the GET /user request, the server doesn't know who the user is and thus cannot know where the user data is hosted; but after the GET request, the server gets the user identity in the web ticket, discovers the server where the user is homed, and returns a URL to that server.

Web tickets are usually issued for a specific server domain and cannot be used to access a different server. This is why when the SDK attempts to access the `applications` URL, it gets an authorization-related error (can be a 401, 403 or 500) and another 4xx/5xx response gets printed to the dev console by the browser. Once the SDK gets another web ticket for the new server FQDN, it sends a POST /applications to create a UCWA endpoint:

```
POST https://sfbwebfes0b0m.infra.contoso.com/.../applications
Authorization: Bearer cwt=AAC...

HTTP 201
{ "rel": "application", "_links": { "self": { href: "/.../application" } } }
```

Once this 201 is received, the sign-in operation is considered to be done and the promise object returned by the **signIn** method is resolved.

```js
app.signInManager.signIn(...).then(() => {
  console.log("POST /applications has returned a 2xx");
});
```

## Integrated Windows Authentication (IWA)
<a name="sectionSection2"> </a>

To sign in using the Integrated Windows Authentication (IWA) flow, provide the _domain_ parameter:

```js
app.signInManager.signIn({
    domain: 'contoso.com'
});
```

The SDK will start with GETs to the lyncdiscover URLs as described above and will use the intergrated auth to get a web ticket. In this mode the SDK doesn't have access to username and password as they are managed by the browser and the operating system.

This auth mode is enabled when 401 responses have `urn:microsoft.rtc:window` in the `WWW-Authenticate.MsRtcOAuth.grant_type` setting.

## Anonymous meeting join
<a name="sectionSection3"> </a>

To sign in using the anonymous meeting join flow, your application needs to provide the URI of the online meeting:


```js
app.signInManager.signIn({
    meeting: 'sip:user123@contoso.com;gruu;opaque=app:conf:focus:id:AHSJDNA'
});
```

The SDK will extract the FQDN from the conference URI and will use it to construct the `lyncdiscover` requests. To get a web ticket, the SDK will extract the conference key from the URI (`AHSJDNA` in this example). The discovery process can be customized as described above.

This auth mode is enabled when 401 responses have `urn:microsoft.rtc:anonmeeting` in the `WWW-Authenticate.MsRtcOAuth.grant_type` setting.

## Passive/ADFS authentication
<a name="sectionSection4"> </a>

You can use the passive authentication if your on-premises server has ADFS configured. To use this auth, set the `auth` param:

```js
app.signInManager.signIn({
    auth: "passive",
    domain: "contoso.com"
});
```

Prior to calling the **signIn** method, the user needs to enter credentials at the ADFS site. Once this is done, the site sends a few auth cookies that get stored in the browser's cache. When the SDK gets a web ticket in this mode, it creates a hidden `<iframe>` element, redirects it to the ADFS site and gets back an `RPSAuth` cookie, which is then exchanged for a web ticket. This authnetication will not work in Safari because it blocks third-party (the ADFS site in this case) cookies by default. For the same reason, this might not work in IE if the ADFS site and your site belong to different trusted zones in the user's instance of IE. If something goes wrong, the SDK won't have a way to detect the failure and thus won't be able to reject the returned promise object. The caller is supposed to be aware of these specifics of ADFS auth and set proper timeouts.

The discovery process can be customized as described above.

This auth mode is enabled when 401 responses have `urn:microsoft.rtc:passive` in the `WWW-Authenticate.MsRtcOAuth.grant_type` setting.

## OAuth2 authentication
<a name="sectionSection5"> </a>

To use this authentication, set `client_id` of your registered app:

```js
app.signInManager.signIn({
  cors: true,
  client_id: "...",
  redirect_uri: "/an/empty/page/on/this/site.html",
  origins: [...]
});
```

The user is supposed to be logged in at the OAuth provider beforehand. The SDK uses a hidden `<iframe>` element to send the OAuth2 request and if the user isn't logged in, the promise object returned by `signIn` will be rejected with an error:

```js
{ code: "OAuthFailed", error: "login_required", error_description: "..." }
```

The discovery process can be customized as described above.

## Additional resources

- [Retrieve the API entry point and sign the user in](GetAPIEntrySignIn.md)
