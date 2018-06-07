/* Copyright (C) Microsoft 2014. All rights reserved. */
(function() {
    "use strict";

    var _generalHelper = new GeneralHelper();

    _generalHelper.namespace("microsoft.rtc.ucwa.samples");

    /// <summary>
    /// LocalStorage is an HTML5 localStorage implementation of a storage object.
    /// </summary>
    microsoft.rtc.ucwa.samples.LocalStorage = (function($) {
        var obj = function LocalStorage() {
            if (!this instanceof LocalStorage) {
                return new LocalStorage();
            }

            var _scope = this,
            _ids = [];

            /// <summary>
            /// Gets or creates a unique id in attempt to store in localStorage without collisions.
            /// </summary>
            /// <param name="id">Identifier to get/create a unique id for.</param>
            /// <returns>Unique id for this id.</returns>
            function getUniqueId(id) {
                var unique = null;

                for (var i = 0; i < _ids.length; i++) {
                    if (_ids[i].key === id) {
                        unique = _ids[i].value;
                        break;
                    }
                }

                if (!unique) {
                    unique = _generalHelper.generateUUID();

                    _ids.push({
                        key: id,
                        value: unique
                    });
                }

                return unique;
            }

            /// <summary>
            /// Initialize data.
            /// </summary>
            /// <param name="object">Object to init the storage.</param>
            /// <returns>Promise object related to this init.</returns>
            obj.prototype.init = function(object) {
                var deferred = $.Deferred();

                for (var i = 0; i < _ids.length; i++) {
                    window.localStorage.removeItem(_ids[i].key);
                }

                _ids.length = 0;
                deferred.resolve();

                return deferred.promise();
            }

            /// <summary>
            /// Create data in storage based on id.
            /// </summary>
            /// <param name="data">Information.</param>
            /// <param name="id">Identifier to data.</param>
            /// <param name="callback">Method to execute upon completion.</param>
            /// <returns>Promise object related to this create.</returns>
            obj.prototype.create = function(data, id, callback) {
                var deferred = $.Deferred(),
                unique = getUniqueId(id);

                window.localStorage.setItem(unique, JSON.stringify(data));
                deferred.resolve(id);

                _generalHelper.safeCallbackExec({
                    callback: callback,
                    params: [
                        id
                    ]
                });

                return deferred.promise();
            }

            /// <summary>
            /// Read data in storage based on id.
            /// </summary>
            /// <param name="id">Identifier to data.</param>
            /// <param name="callback">Method to execute upon completion.</param>
            /// <returns>Promise object related to this read.</returns>
            obj.prototype.read = function(id, callback) {
                var deferred = $.Deferred(),
                unique = getUniqueId(id),
                data = JSON.parse(window.localStorage.getItem(unique));

                deferred.resolve(data);

                _generalHelper.safeCallbackExec({
                    callback: callback,
                    params: [
                        data
                    ]
                });

                return deferred.promise();
            }

            /// <summary>
            /// Update data in storage based on id.
            /// </summary>
            /// <param name="data">Information.</param>
            /// <param name="id">Identifier to data.</param>
            /// <param name="callback">Method to execute upon completion.</param>
            /// <returns>Promise object related to this update.</returns>
            obj.prototype.update = function(data, id, callback) {
                var deferred = $.Deferred();

                _scope.create(data, id).done(function(id) {
                    deferred.resolve(id);

                    _generalHelper.safeCallbackExec({
                        callback: callback,
                        params: [
                            id
                        ]
                    });
                });

                return deferred.promise();
            }

            /// <summary>
            /// Delete data in storage based on id.
            /// </summary>
            /// <param name="id">Identifier to data.</param>
            /// <param name="callback">Method to execute upon completion.</param>
            /// <returns>Promise object related to this delete.</returns>
            obj.prototype.delete = function(id, callback) {
                var deferred = $.Deferred(),
                unique = getUniqueId(id);

                window.localStorage.removeItem(unique);

                deferred.resolve(id);

                _generalHelper.safeCallbackExec({
                    callback: callback,
                    params: [
                        id
                    ]
                });

                return deferred.promise();
            }
        };

        return obj;
    }(jQuery));
}());