# Gathering Console Logs from the Skype Web SDK or Conversation Control

**In this article:**

- [Enable browser console logging in real-time](#real-time)
- [Enable browser console silent logging and download log file](#save-console)

Console logs are invaluable for troubleshooting any issue related to the Skype Web SDK. If you're trying to troubleshoot an issue on your own, you can first try enabling console logging in real-time. If you're just interested in saving console logs for an error report, or you'd prefer to run your scenario and then examine the logs after, you can enable silent logging and then download the results once the scenario is complete. 

<a name="real-time"></a>
## Enable browser console logging in real-time

The SDK provides the following flags for enabling logging related to its different components. You can set any or all of these flags to `true` to enable logging related to that component.

- `Skype.Web.Settings.timestamps`: Prepend a timestamp to all log statements (useful in browsers that don't natively support timestamps with console logs)
- `Skype.Web.Settings.logHttp`: Log all requests to the server and UCWA events received from the server
- `Skype.Web.Settings.logModel`: Log information related to the state of the SDK model components
- `Skype.Web.Settings.logMedia`: Log information related to AV calling

To enable all possible logging, run the following code snippet in the developer console:

``` js
Skype.Web.Settings.timestamps = true;
Skype.Web.Settings.logHttp = true;
Skype.Web.Settings.logModel = true;
Skype.Web.Settings.logMedia = true;
```

<a name="save-console"></a>
## Enable browser console silent logging and download log file

On a page with the Skype Web SDK loaded, open the developer console and enter the following: 

``` js
Skype.Web.Settings.saveConsole = true;
```

This statement will cause the output of all possible debugging statements to be saved to a circular buffer with a maximum size of 4MB. If a new logging statement will cause the buffer to exceed its maximum size, logs will be removed from the beginning of the buffer to ensure that there is space for the new statement. Therefore at any time after the `saveConsole` flag is turned on the buffer will contain the most recent 4MB of debugging statements.

After turning on logging, reproduce your issue, then run the following command in the developer console to download the contents of the log buffer:

``` js
Skype.Web.Utils.debug.saveConsole('<DESCRIPTIVE_FILE_NAME>');
```

Include the downloaded log file with your issue report.

> [!NOTE]
> **About browser compatibility:** The implementation of this feature is different across different browsers and may not be supported in uncommon or older browsers. In **Safari**, after typing this command, you have to click anywhere in the page, and a new tab should open to a page that contains the text of the log buffer. You then need to manually save this page as a text file.

