/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var _generalHelper = new GeneralHelper();

    _generalHelper.namespace("microsoft.rtc.ucwa.samples");

    /// <summary>
    /// Batch is responsible for packaging multiple HTTP requests into a single 
    /// request that is sent with a Transport object.
    /// </summary>
    /// <param name="cache">Cache object used during batching.</param>
    /// <param name="transport">Transport object used during batching.</param>
    /// <param name="timerLimit">Timer limit in milliseconds (ms) until outstanding requests are sent.</param>
    /// <remarks>
    /// For more information about multipart, see the RFC:
    ///     https://www.ietf.org/rfc/rfc2046
    /// It has a queuing mechanism that stores up to 20 requests before sending. 
    /// The queue can also be sent as a result of a timer elapsing (defaults to three seconds)
    /// or explicitly with a call.
    /// </remarks>
    microsoft.rtc.ucwa.samples.Batch = (function($) {
        var obj = function Batch(cache, transport, timerLimit) {
            if (!this instanceof Batch) {
                return new Batch();
            }

            // The default content type for each batch part
            var _defaultType = "application/json",
            // The current queue of requests to be sent as a batch
            _batchQueue = [],
            // The size of the batch queue
            _batchSize = 20,
            // The ID of the timer object created by setTimeout()
            _timerId = null,
            // The default amount of the time, in ms, before a batch is sent (three seconds)
            _defaultTimerLimit = 3000;

            /// <summary>
            /// Builds an HTTP request based on supplied content.
            /// </summary>
            /// <param name="content">Object containing HTTP request data.</param>
            /// <remarks>
            /// content should be an object in the form of:
            /// {
            ///     url: "myLink" (HTTP request URL),
            ///     type: "get" (get, post, put, delete),
            ///     acceptType: "application/json" (default, can be omitted),
            ///     data: "hello world" (any kind of JSON data),
            /// }
            /// </remarks>
            /// <returns>
            /// Message object based on supplied content in the form of:
            /// {
            ///     request: "GET https://www.example.com HTTP/1.1",
            ///     Host: "https://www.example.com",
            ///     Accept: "application/json",
            ///     data: "hello world" (any kind of JSON data)
            /// }
            ///</returns>
            function buildMessage(content) {
                var host = null,
                request = null,

                // Determine if the URL is absolute or relative
                index = content.url.indexOf("://"),
                isAbsolutePath = index !== -1;

                if (isAbsolutePath) {
                    index += 3;

                    // Grab the host portion of the URL - [char 0 to the third slash]
                    // [https://example.com/]path/to/file.html
                    host = content.url.slice(index).split("/", 1)[0];
                    request = content.type.toUpperCase() + " " + content.url.slice(index + host.length) + " " + "HTTP/1.1";
                } else {
                    var index = transport.getDomain().indexOf("://");

                    if (index !== -1) {
                        host = transport.getDomain().slice(index + 3);
                    } else {
                        host = transport.getDomain();
                    }

                    request = content.type.toUpperCase() + " " + content.url + " " + "HTTP/1.1";
                }

                var message = {
                    Request: request,
                    Host: host,
                    Accept: content.acceptType,
                    Data: content.data
                };

                return message;
            }

            /// <summary>
            /// Sends a batch request using the previously supplied Transport object.
            /// </summary>
            /// <remarks>
            /// Builds up a multipart/batching message to be sent as an HTTP request 
            /// using the Transport library. It creates a listing of callbacks 
            /// to be executed when the response is returned from the request by using 
            /// Mime.js to parse the response and then passing the specific result to 
            /// the correct caller.
            /// </remarks>
            function sendBatch() {
                var boundary = _generalHelper.generateUUID(),
                contentType = "multipart/batching;boundary=" + boundary,
                parts = [],
                callbacks = [];

                for (var item in _batchQueue) {
                    parts.push(createDataPart(_batchQueue[item].message, boundary));
                    callbacks.push(_batchQueue[item].callback);
                }

                var method = function(data) {
                    var mime = new microsoft.rtc.ucwa.samples.Mime();
                    var results = mime.processMessage(data);

                    for (var i = 0; i < results.length; i++) {
                        _generalHelper.safeCallbackExec({
                            callback: callbacks[i],
                            params: [
                                results[i]
                            ],
                            error: "Encountered error executing batch callback"
                        });
                    }
                }

                var data = parts.join("\r\n");
                data += "\r\n\r\n--" + boundary + "--\r\n";

                cache.read({
                    id: "main"
                }).done(function(cacheData) {
                    transport.clientRequest({
                        url: cacheData._links.batch.href,
                        type: "post",
                        data: data,
                        acceptType: "multipart/batching",
                        contentType: contentType,
                        callback: method
                    });
                });
            }

            /// <summary>
            /// Creates a multipart message object based on the supplied data 
            /// and boundary.
            /// </summary>
            /// <param name="part">Message object containing data.</param>
            /// <param name="boundary">Boundary that separates messages.</param>
            /// <remarks>
            /// Builds a message with the correct line endings so it can be 
            /// interpreted correctly as a multipart message.
            /// </remarks>
            /// <returns>String representing the Message object.</returns>
            function createDataPart(part, boundary) {
                var dataPart = "\r\n--" + boundary;
                dataPart += "\r\nContent-Type: application/http; msgtype=request\r\n";
                dataPart += "\r\n" + part.Request;
                dataPart += "\r\n" + "Host: " + part.Host;
                dataPart += "\r\n" + "Accept: " + part.Accept;

                if (part.Data) {
                    dataPart += "\r\n" + "Data: " + JSON.stringify(part.Data);
                }

                dataPart += "\r\n";

                return dataPart;
            }

            /// <summary>
            /// Queues an HTTP request to be sent at a later time.
            /// </summary>
            /// <param name="request">HTTP request object (like that from the Transport library).</param>
            /// <remarks>
            /// The request parameter should an object in the form of:
            /// {
            ///     url: "myLink" (HTTP request URL),
            ///     type: "get" (get, post, put, delete),
            ///     acceptType: "application/json" (default, can be omitted),
            ///     data: "hello world" (any kind of JSON data),
            ///     callback: function(data) {...} (a callback function)
            /// }
            /// Not all parameters are shown. See Tranport's clientRequest for the 
            /// full set of parameters. The request object will be changed into a 
            /// Message object and put on the batch queue. If the queue grows past 
            /// its limit, it will trigger the immediate processing of the 
            /// outstanding requests. If not, a timer will start, helping to facilitate 
            /// batch processing.
            /// </remarks>
            obj.prototype.queueRequest = function(request) {
                var message = buildMessage({
                    url: request.url,
                    type: request.type,
                    acceptType : _generalHelper.getValue(_defaultType, request.acceptType),
                    data: request.data,
                });

                if (message) {
                    _batchQueue.push({
                        message: message,
                        callback: request.callback
                    });

                    if (_batchQueue.length >= _batchSize) {
                        processBatch();
                    } else if (!_timerId) {
                        var scope = this;

                        _timerId = window.setTimeout(function() {
                            scope.processBatch();
                        }, _generalHelper.getValue(_defaultTimerLimit, timerLimit));
                    }
                }
            }

            /// <summary>
            /// Begins immediate processing of the batch queue, regardless of timer or queue size.
            /// </summary>
            /// <remarks>
            /// Checks to see if the batch queue has any outstanding requests. 
            /// If so, it begins immediate processing. If a timer was active, 
            /// it will be cleared. After the batch request is sent, the queue 
            /// is cleared.
            /// </remarks>
            obj.prototype.processBatch = function() {
                if (_batchQueue.length !== 0) {
                    if (_timerId) {
                        window.clearTimeout(_timerId);
                        _timerId = null;
                    }
                    
                    sendBatch();
                    _batchQueue.length = 0;
                }
            }
        };

        return obj;
    }(jQuery));
}());