# Gathering Logs from a Skype for Business Desktop Client

**In this article:**
- [Logs available for the Skype for Business desktop client](#log-types)
- [Collecting logs from a Skype for Business desktop client](#collecting-logs)

If your failure scenario involves a Skype for Business desktop client as the remote endpoint in a chat conversation or AV call, then you should include the logs from the desktop client in your error report.
You can view the desktop client logs on your own, but we haven't documented the logging format so you probably won't find resources to make sense of them. Instead, collect the logs and submit them with your bug report. 

<a name="log-types"></a>
## Logs available for the Skype for Business desktop client

There are two types of logs available from the desktop client:

- **.UccApilog** files contain general client usage information
- **.etl** files contain media-specific log information

For any bugs related to Audio/Video, please attach both log types if possible. For bugs not related to Audio/Video, the **.UccApilog** files should be sufficient.

<a name="collecting-logs"></a>
## Collecting logs from a Skype for Business desktop client

On a Windows machine, the logs for a Skype for business desktop client will be located in the following directory:

>**%LOCALAPPDATA%\Microsoft\Office\16.0\Lync\Tracing** 

The **.UccApilog** files will have names that look like this:
>**Lync-UccApi-[[n]].UccApilog** where **[[n]]**
should be replaced by a number 0-2.

The **.etl** media log files will have names that look like this:
>**Lync-16.0.6965.5305-Office-x86ship-U.etl**

On a Mac, the logs are in a similar directory within the root directory where the desktop client is installed.

After reproducing the issue and closing the client, navigate to this directory and select the log file(s) with the most recent timestamp(s). This is the file you should submit with any bug report.
