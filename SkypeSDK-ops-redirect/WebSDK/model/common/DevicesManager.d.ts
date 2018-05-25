/// <reference path="pm.d.ts" />
/// <reference path="VideoChannel.d.ts" />

declare module jCafe {

    /** 
     *       "Camera"
     *       "Microphone"
     *       "Speaker" 
     */
    export type DeviceType = string;
    
    export interface Device {

        id: Property<string>;
        name: Property<string>;
        type: Property<DeviceType>;
    }
    
    export interface Camera extends Device {
        /** Use this channel to preview video from this camera */
        localVideoChannel: VideoChannel;
    }
    
    export interface Microphone extends Device {
    }
    
    /** Can be selected only when the plugin is used */
    export interface Speaker extends Device {
    }

    export interface MediaCapabilities {
        /**
         * This property indicates whether ORTC/WebRTC is supported in the browser.
         * Its value shall be resolved right after an Application is constructed and
         * stay unchanged. When this property is true, the model layer will automatically
         * choose to use ORTC/WebRTC to carry out media (audio/video) communication.
         */
        isBrowserMediaSupported: Property<boolean>;
        /**
         * This property indicates whether the plugin is installed in the system.
         * Returns:
         * - undefined if the plugin object is not loaded
         * - true if the latest plugin is installed
         * - true if a compatible plugin is installed, with reason code 'CompatiblePluginInstalled'
         * - false if an obsolete plugin is installed, with reason code 'ObsoletePluginInstalled'
         * - false if no plugin is installed, with reason code 'NoPluginInstalled'
         *
         * Please note that the value of this property depends on whether the plugin
         * object is loaded or not, which has a 'lazy-loading' by nature. It means the
         * plugin object is not loaded unless requested, either by a get on any media
         * related property (e.g., isPluginInstalled.get, or DevicesManager.cameras.subscribe),
         * or by starting/accepting an audio/video call. When plugin object is not loaded,
         * this property will stay undefined.
         *
         * The recommended usage pattern is:
         * - check the value of this property
         * - if it is true, continue with the media related operations
         * - otherwise (undefined or false), do a get of this property
         * - when the get returns, if the value is true, continue with the media related operations
         * - otherwise, check the isPluginInstalled.reason code, and provide the user with the URLs stored in the pluginDownloadLinks collection
         *
         * Here are some sample code:
         *
         *      function handleAVCall(actualAVCall) {
         *          var cap = app.devicesManager.mediaCapabilities;
         *          if (cap.isBrowserMediaSupported() || cap.isPluginInstalled()) {
         *              actualAVCall();
         *          } else {
         *              cap.installedVersion.get().finally(function () {
         *                  var p = cap.isPluginInstalled;
         *                  var r = p.reason;
         *                  if (p()) {
         *                      if (r == 'CompatiblePluginInstalled') {
         *                          // optional:
         *                          // tell user which version is detected: cap.installedVersion()
         *                          // recommend user to upgrade plugin to latest
         *                          // using cap.pluginDownloadLinks('msi') etc.
         *                      }
         *                      actualAVCall();
         *                  } else {
         *                      if (r == 'ObsoletePluginInstalled') {
         *                          // tell user which version is detected: cap.installedVersion()
         *                      } else if (r == 'NoPluginInstalled') {
         *                          // tell user no plugin is detected
         *                      }
         *                      // recommend user to upgrade plugin to latest
         *                      // using cap.pluginDownloadLinks('msi') etc.
         *                  }
         *              });
         *          }
         *      }
         */
        isPluginInstalled: Property<boolean>;
        /**
         * This property stores the version number of the installed plugin.
         * It bears the same 'lazy-loading' nature as the isPluginInstalled property, so it
         * is recommended that these two properties be used together to provide better user
         * experience.
         */
        installedVersion: Property<string>;
        /**
         * A collection of URLs to download the latest plugin.
         *
         * The download URLs can be specified as Application level settings:
         *
         *      var app = new Application({
         *          settings: {
         *              plugin.download.msi: 'http://cdn-url/plugin.msi',
         *              plugin.download.pkg: 'http://cdn-url/plugin.pkg',
         *              plugin.download.dmg: 'http://cdn-url/plugin.dmg'
         *      });
         *
         * If these settings are not specified, default download links are provided by the WebSDK.
         * In that situation, similar to the isPluginInstalled property, the default links will
         * only be added to the collection when the application triggers the loading of the plugin
         * object; otherwise, this collection will stay empty.
         */
        pluginDownloadLinks: Collection<string>;

        /**
         * Indicates whether the user has granted permission to the app to use the microphone.
         * This is relevant only for pluginless scenarios. For plugin this just needs to return true.
         */
        isMicrophoneEnabled: Property<boolean>;

        /**
         * Indicates whether the user has granted permission to the app to use the camera.
         * This is relevant only for pluginless scenarios. For plugin this just needs to return true.
         */
        isCameraEnabled: Property<boolean>;
    }

    /**
     * Holds collections of audio and video devices.
     */
    export interface DevicesManager {
        
        selectedCamera: Property<Camera>;
        selectedMicrophone: Property<Microphone>;
        selectedSpeaker: Property<Speaker>;

        cameras: Collection<Camera>;
        microphones: Collection<Microphone>;
        speakers: Collection<Speaker>;

        mediaCapabilities: MediaCapabilities;
    }
}