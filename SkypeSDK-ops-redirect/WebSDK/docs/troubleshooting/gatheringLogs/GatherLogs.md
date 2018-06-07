# Gathering logs to troubleshoot issues and submit error reports 

 _**Applies to:** Skype for Business 2015_

 **In this article**

- [Who is this article for?](#audience)
- [What logs will help me troubleshoot my issue?](#logs-for-self)
- [How can I submit an error report?](#logs-for-report)
- [Related topics](#related-topics)
- [External resources](#external-resources)

<a name="audience"></a>
## Who is this article for?

If you are a developer adding the Skype Web SDK or Conversation Control into your web app and you aren't able to debug an issue with the help of the troubleshooting and programming documentation, this guide explains SDK activity log types used for troubleshooting.
If you can't resolve your issue by looking at the logs on your own, this guide provides instructions for submitting an error report to the SDK development team.

<a name="logs-for-self"></a>
## What logs will help me troubleshoot my issue?

Depending on the type of issue you're facing, there are different logs which may be relevant to you.

For all issues regarding the SDK, the best place to start is with the [browser console logs](./Logs-Console.md). Another useful source of logs is an [Internet traffic trace](./Logs-WebTraffic.md). You can get this trace by using a web debugging proxy such as [Fiddler](http://www.telerik.com/fiddler) or [Charles](https://www.charlesproxy.com/).

If you cannot resolve your issue by looking at either of these logs or reviewing the appropriate [reference documentation](../../GeneralReference.md), you should submit an error report.

<a name="logs-for-report"></a>
## How can I submit an error report?

**Prerequisites**

You must modify your code and provide a valid **version** parameter when calling **signInManager.signIn** of the form **\<your-app-name\>/\<version-number\>**, and a valid, unique-per-session **correlationIds.sessionId** upon calling **Skype.initialize**. For example, your code should include snippets like this for initializing and signing into the SDK:

``` js
Skype.initialize({ 
    apiKey: '...',
    correlationIds: {
        sessionId: '<unique-session-id>', // Necessary for troubleshooting requests, should be unique per session
    }}, function (api) {
        app = new api.application();

        // Perform additional authentication steps ...

        app.signInManager.signIn({
            // other auth-specific parameters ...
            version: '<your-app-name>/<version-number>' // Necessary for troubleshooting requests; identifies your application in our telemetry
        });
    }
);
```

**What to submit**

If you would like to submit an error report to the Skype Web SDK team, you must include the [browser console logs](./Logs-Console.md), a [web traffic trace](./Logs-WebTraffic.md), and the following information:

- Client topology type (onprem/online)
- Host domain name (eg. "app.contoso.com")
- AAD Client ID if online topology using OAuth through AAD
- ECS API key (used to select the appropriate 'flavor' of the Web SDK or Conversation Control)
- SDK version - find this by executing `Skype.Web.version` in the browser console
- The **sessionId** provided by your app when initializing the SDK of a session in which your failure occurred (see **prerequisites**)
- All parameters to the signIn function except passwords, especially app name and version number (see **prerequisites**)

> [!WARNING]
> **About web traffic traces:** When submitting web traffic traces with an error report, you will need to turn HTTPS decryption on, but this carries the risk that your decrypted passwords and other sensitive information may be included in the trace. Before posting such traces on a public forum such as **StackOverflow** or **GitHub**, make sure to search the trace for any passwords or sensitive text strings and delete records containing them.

If your issue involves AV calling and you could not resolve the issue by looking at any of the logs mentioned in the previous section, then you should also include the [appropriate media logs](./Logs-Media.md) with your error report.

If your failure scenario involves interaction between your Web SDK app and another type of Skype for Business client, such as the Skype for Business desktop client, then you should also collect the [logs from that client](./Logs-DesktopClient.md) if possible.

Once you have all this information, you can either open an **issue** on [our GitHub page](https://github.com/OfficeDev/skype-docs/issues), or [ask a question on StackOverflow](http://stackoverflow.com/questions/tagged/skypedeveloper) - just make sure to tag your question with the **skypedeveloper** tag.

<a name="related-topics"></a>
## Related topics

- [Gathering Console Logs from the Skype Web SDK or Conversation Control](./Logs-Console.md)
- [Gathering Web Traffic Logs from the Skype Web SDK or Conversation Control](./Logs-WebTraffic.md)
- [Gathering Media Logs from the Skype Web SDK or Conversation Control](./Logs-Media.md)
- [Gathering Logs from a Skype for Business Desktop Client](./Logs-DesktopClient.md)

<a name="external-resources"></a>
## External resources

- [Skype Web SDK GitHub page](https://github.com/OfficeDev/skype-docs/issues)
- [Skype Web SDK on StackOverflow](http://stackoverflow.com/questions/tagged/skypedeveloper)


