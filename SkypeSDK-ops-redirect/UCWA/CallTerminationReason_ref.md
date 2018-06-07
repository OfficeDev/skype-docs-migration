
# CallTerminationReason


_** Applies to: **Skype for Business 2015_

The reason why a call was terminated.
            
## Members



|**Name**|**Description**|
|:-----|:-----|
|CallEstablishFailureBothInternal|The call failed to establish due to a media connectivity failure where both endpoints are internal.|
|CallEstablishFailureOneInternalOneExternal|The call failed to establish due to a media connectivity failure where one endpoint is internal and the otheris remote.|
|Cancel|The call was cancelled by client.|
|CodecMismatch|The call failed because of codec mismatch|
|ConversationSuspendedLossNetwork|The conversation was terminated due to a loss of network.|
|FailedStartAudioStream|The call failed to establish because the audio stream could not be started.|
|InternalFailure|The call was terminated due to an internal failure on the client.|
|InvalidMediaAnswer|The call failed because of invalid SDP in response|
|MediaConnectivityFailure|The call failed because of media connectivity failure.|
|MediaTimeout|The call failed because of media timeout.|
|MidCallFailureBothInternal|The call was termianted on a mid-call media failure where both endpoints are internal.|
|MidCallFailureOneInternalOneExternal|The call was terminated on a mid-call media failure where one endpoint is internal and the other is remote.|
|SharerLeftConference|The app sharing call was terminated because the sharer left the conference.|
|Unknown|ResponseCode was not specified.|
|UnsupportedMedia|The call failed because of media negotiation problem|
|UserInitiatedAction|The call was terminated by user-initiated action.|
