# Checking for and handling application errors

_**Applies to:** Skype for Business 2015_

**In this article**
- [List of application errors](#listOfErrors)
- [Format of errors and how to check for them](#errorAPI)

> [!NOTE]
> Application errors in the below format are currently only surfaced from the authentication API's (e.g. signinManager.signin or through the custom auth function)

<a name="listOfErrors"></a>
### List of application errors

| error code | message | category |
|---|----|----|
| 1 | The user appears to be homed on premise. Make sure to home the user online to use this service. | InvalidSetup |
| 28000 | The user does not have a valid Skype for Business Online license assigned. | InvalidSetup |
| 28032 | The web ticket is invalid. | Unauthorized |
| 28033 | The web ticket has expired. | Unauthorized |
| 28055 | The OAuth token is invalid. | Unauthorized |
| 28056 | The OAuth token has expired. | Unauthorized | 
| 28072 | The ticket presented could not be verified, a new ticket is required. | Unauthorized |
| 28077 | Invalid Audience in the web ticket. | Unauthorized |
| 28081 | No user principal name is found in JWT security token. | Unauthorized |



#### Error categories

| identifier | description |
| --- | --- |
| InvalidSetup | Please check with the administrator of your tenant. |
| Unauthorized | The user is unauthorized. Make sure the user is authenticated with a valid access token before making the request. | 

<a name="errorAPI"></a>
### Error API and how to check for them

Error messages are exposed in following format:

```js
{
    errorDetails: {
        code: <error code>,
        message: <error message>,
        category: {
            identifier: <error category identifier>,
            description: <error category description>
        }
    }
}
```

In the sign in scenario you would check for the error details in following way:

```js
    signinManager.signin().then(function successCallback (){}, function errorCallback (error){
        if (error.errorDetails) {
            //consume and act on error
        }
    });
```