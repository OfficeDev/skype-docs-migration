
# Retrieve the API entry point and sign in a user


 _**Applies to:** Skype for Business 2015_


The [Application](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.application.html) object is created by invoking the **Application** class constructor with the **new** keyword. This is the only SDK object that can be constructed in application logic. All other SDK types are accessed by reading properties or invoking functions on application.

The [SignInManager.SignIn](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.signinmanager.html#signin) method and the [SignInManager.SignOut](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.signinmanager.html#signout) method are asynchronous and return a [Promise](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.promise.html) object. Use the **Promise#then** method to set operation success or failure callbacks.


 >**Note**: To enable audio/video functionality for IE 11 and Safari you need to install the Skype for Business Web App Plug-in. It is available for Windows and Mac computers:  
 - [Windows Download](https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeMeetingsApp.msi)
 - [Mac Download](https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeForBusinessPlugin.pkg)

### Get the SDK entry point and sign in a user

Add a reference to the bootstrapper to your HTML file.


BY USING THE SOFTWARE LOCATED HERE: [https://swx.cdn.skype.com](https://swx.cdn.skype.com), YOU ACCEPT THE _[Microsoft Software License Terms](TermsOfService.md)_ IF YOU DO NOT ACCEPT THEM, DO NOT USE THE SOFTWARE.

>**Note**: These license terms apply to the use of the content from the domain swx.cdn.skype.com.

```html
<script src="https://swx.cdn.skype.com/shared/v/1.2.15/SkypeBootstrap.min.js"></script>
```

Download the SDK package. In the following snippet, we are using public preview API keys. You can see all available API keys by reading [Skype Web SDK Production Use Capabilities](APIProductKeys.md)

```js

var config = {
 apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255', // SDK
 apiKeyCC: '9c967f6b-a846-4df2-b43d-5167e47d81e1' // SDK+UI
}; 

Skype.initialize({ apiKey: config.apiKey }, function (api) {
  Application = api.application; // this is the Application constructor
}, function (err) {
  console.log("cannot load the sdk package", err);
});
```


Call the [Application](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.application.html) constructor.

```js
app = new Application;
```

Sign the user in by calling the  **Application#signInManager.signIn** method.

```js
app.signInManager.signIn ({
  username: '****',
  password: '****'
}).then(() => {
  console.log("signed in as", app.personsAndGroupsManager.mePerson.displayName());
}, err => {
  console.log("cannot sign in", err);
});
```

>**Note:** If sign in fails or you call **signOut**, you must create a new [Application](http://officedev.github.io/skype-docs/Skype/WebSDK/model/api/interfaces/jcafe.application.html) object and make the new sign in attempt with that object. The original application object will not be able to attempt a new sign in operation.

The following example uses the password grant authentication to sign a user in with a username and password.

```html
<!doctype html>
<html>
<head>
  <title>My Skype Web SDK app</title>
  <script src="https://swx.cdn.skype.com/shared/v/1.2.15/SkypeBootstrap.min.js"></script>
</head>
<body>
  <script>
    Skype.initialize({ apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255' }, api => {
      var app = new api.application;
      
      app.signInManager.signIn ({
        username: '****',
        password: '****'
      }).then(() => {
        console.log("signed in as", app.personsAndGroupsManager.mePerson.displayName());
      }, err => {
        console.log("cannot sign in", err);
      });
    }, err => {
      console.log("cannot load the sdk package", err);
    });
  </script>
</body>
</html>
```

