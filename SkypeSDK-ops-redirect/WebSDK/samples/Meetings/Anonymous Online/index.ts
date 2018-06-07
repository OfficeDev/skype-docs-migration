/// <reference path="../../../framework.d.ts" />
/// <reference path="../../utils/video-utils.ts" />

(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTMeetingsAnonJoinOnline.md' : 'Content/websdk/docs/PTMeetingsAnonJoinOnline.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var app;
    var conversation;
    var listeners = [];

    var discoverUrl = "";
    var authToken = "";
    var meetingUrl = "";

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.anon_name'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.anon_name')).value = '';
        (<HTMLElement>content.querySelector('.selfVideoContainer')).innerHTML = '';
        (<HTMLElement>content.querySelector('.remoteVideoContainers')).innerHTML = '';
        (<HTMLElement>content.querySelector('#selfvideo')).style.display = 'none';
        (<HTMLElement>content.querySelector('#remotevideo')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.join')).disabled = false;
    }

    function cleanupConversation() {
        if (conversation && conversation.state() !== 'Disconnected') {
            conversation.leave().then(() => {
                conversation = null;
            });
        } else {
            conversation = null;
        }
    }

    function reset(bySample: Boolean) {
        window.framework.hideNotificationBar();
        content.querySelector('.notification-bar').innerHTML = '<br/> <div class="mui--text-subhead"><b>Events Timeline</b></div> <br/>';

        meetingUrl = "";
        discoverUrl = "";
        authToken = "";

        // remove any outstanding event listeners
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].dispose();
        }
        listeners = [];

        if (conversation) {
            if (bySample) {
                cleanupConversation();
                cleanUI();
            } else {
                const result = window.confirm('Leaving this sample will end the conversation.  Do you really want to leave?');
                if (result) {
                    cleanupConversation();
                    cleanUI();
                    restart();
                }

                return result;
            }
        } else {
            cleanUI();
        }
        if (app.signInManager.state() == 'SignedIn') {
            app.signInManager.signOut();
            window.framework.addNotification('info', 'Signed out of anonymous conference');
        }
    }

    function restart() {
        goToStep(1);
        (<HTMLElement>content.querySelector('#selfvideo')).style.display = 'none';
        (<HTMLElement>content.querySelector('#remotevideo')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.join')).disabled = false;
        (<HTMLInputElement>content.querySelector('.getToken')).disabled = false;
    }

    function joinMeeting () {
        if (!(<HTMLInputElement>content.querySelector('.anon_name')).value) {
            window.framework.addNotification('info', 'Please enter a name to use ' + 
                'for joining the meeting anonymously');
            return;
        }

        (<HTMLInputElement>content.querySelector('.join')).disabled = true;
        const name = (<HTMLInputElement>content.querySelector('.anon_name')).value;
        const conversationsManager = app.conversationsManager;
        var isActiveSpeakerMode;

        window.framework.addNotification('info', 'Attempting to join conference anonymously');
        
        app.signInManager.signIn({
            name: name,
            cors: true,
            root: { user: discoverUrl },
            auth: function (req, send) {
                // Send token with all requests except for the GET /discover
                if (req.url != discoverUrl)
                    req.headers['Authorization'] = authToken;
                
                return send(req);
            }
        }).then(() => {
            // When joining a conference anonymously, sdk automatically creates
            // a conversation object to represent the conference being joined
            conversation = conversationsManager.conversations(0);

            const vidUtils = VideoUtils(conversation, content, listeners, 2, 4, reset);

            window.framework.addNotification('success',
                'Successfully signed in with anonymous online meeting token');
            vidUtils.setUpListeners();
            vidUtils.startVideoService();
        }).catch(err => {
            window.framework.addNotification('error',
                'Unable to join conference anonymously: ' + err);
        });
    }
    
    function endConversation () {
        window.framework.addNotification('info', 'Ending conversation...');
        if (!conversation) {
            reset(true);
            restart();
            return;
        }
        conversation.leave().then(() => {
            window.framework.addNotification('success', 'Conversation ended');
            goToStep(4);
        }, error => {
            window.framework.addNotification('error', error);
        }).then(() => {
            reset(true);
        });
    }

    if (window.framework.application && window.framework.application.signInManager.state() == 'SignedIn') {
        if (confirm('You must sign out of your existing session to anonymously join ' +
                    'a meeting. Sign out now?'))
            window.framework.application.signInManager.signOut();
        else {
            window.framework.addNotification('error', 'Must refresh the page or allow sign ' +
                'out in order to use this sample.');
            goToStep(4);
        }
    }

    app = window.framework.api.UIApplicationInstance;

    window.framework.registerNavigation(reset);

    window.framework.addEventListener(content.querySelector('.join'), 'click', joinMeeting);    
    window.framework.addEventListener(content.querySelector('.end'), 'click', endConversation);
    window.framework.addEventListener(content.querySelector('.restart'), 'click', restart);
    window.framework.addEventListener(content.querySelector('.getToken'), 'click', getToken);

    function getToken() {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.meeting_url')).value) {
            window.framework.addNotification('info', 'Please enter a meeting_url to get an anonymous token for');
            return;
        }

        (<HTMLInputElement>content.querySelector('.getToken')).disabled = true;
        meetingUrl = (<HTMLInputElement>content.querySelector('.meeting_url')).value;

        var allowedOrigins = window.location.href;
        var serviceUrl = "https://acceptandbridgeimquickstart.azurewebsites.net";

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    window.console.log(request.responseText);
                    window.framework.addNotification('success', 'Successfully got anonymous auth token');

                    var response = JSON.parse(request.response);
                    discoverUrl = response.DiscoverUri;
                    authToken = "Bearer " + response.Token;

                    goToStep(2);
                } else {
                    window.framework.addNotification('error', 'Unable to fetch anon token: ' +
                        request.responseText);
                }
            }
        };

        var data = "ApplicationSessionId=" + window.framework.utils.guid() +
            "&AllowedOrigins=" + encodeURIComponent(allowedOrigins) +
            "&MeetingUrl=" + encodeURIComponent(meetingUrl);

        request.open('post', serviceUrl + "/GetAnonToken");
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(data);
    }

    function goToStep(step) {
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step4')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step' + step)).style.display = 'block';
    }

})();
