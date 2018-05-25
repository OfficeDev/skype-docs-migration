declare module jCafe {

    /**
     *
     *       "RequestFailed"   //  An HTTP request has failed.
     */
    export type ReasonCode = string;

    /** The unified interface of error messages thrown by the sdk.
     *
     *  Instances of this interfaces usually appear as the final result
     *  of a failed async operation such as "send message" or "start call."
     *  
     *  An error handler needs to check the Code first, which is always
     *  present, and then based on the code check the Reason which is present
     *  for some complex errors:
     *  
     *      sendMessage(text).then(null, (err) => {
     *          if (err.code == "NotFound") {
     *              if (err.reason.code == "ReferenceError") {
     *                  //...
     *              }
     *          }
     *      });
     *  
     *  Some error interfaces may inherit from this interface to add more
     *  fields specific to the operation. For instance a RequestFailed error
     *  may add a field called Response:
     *  
     *      sendMessage(text).then(null, (err) => {
     *          if (err.code == "RequestFailed") {
     *              if (err.response.status == 404) {
     *                  ...
     *              }
     *          }
     *      }); 
     */
    export interface Reason {
        code: ReasonCode;
        reason?: Reason;
    }
}