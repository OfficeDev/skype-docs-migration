
# Authentication using Username and Password

 _**Applies to:** Skype for Business 2015_

After bootstrapping the Skype Web SDK we have access to an api object which exposes an application object.  If we create a new instance of an application we get access to a signInManager.  The signInManager provides us with a signIn(...) method, to which we can supply a version, username, and password to authenticate.

## Provide a username and password to authenticate

1. Provide a username and password to authenticate.

  ```js
    var application = api.UIApplicationInstance;
    application.signInManager.signIn({
        version: version,
        username: username,
        password: password
    }).then(function () {
        console.log('Signed in successfully.');
    }, function (error) {
        console.log('Failed to sign in.');
    }).then(reset);
  ```
