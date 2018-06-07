/// <reference path="../../../framework.d.ts" />
/// <reference path="../../utils/video-utils.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTMeetingsAuthJoin.md' : 'Content/websdk/docs/PTMeetingsAuthJoin.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation,
        listeners = [];

    var meetingUri;

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.uri'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.uri')).value = '';
        (<HTMLElement>content.querySelector('.selfVideoContainer')).innerHTML = '';
        (<HTMLElement>content.querySelector('.remoteVideoContainers')).innerHTML = '';
        (<HTMLElement>content.querySelector('#selfvideo')).style.display = 'none';
        (<HTMLElement>content.querySelector('#remotevideo')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
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

        meetingUri = "";

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
    }

    function restart() {
        goToStep(1);
        (<HTMLElement>content.querySelector('#selfvideo')).style.display = 'none';
        (<HTMLElement>content.querySelector('#remotevideo')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
    }

    function joinMeeting () {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.uri')).value) {
            window.framework.addNotification('info', 'Please enter valid conference URI to join');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const conversationsManager = window.framework.application.conversationsManager;
        meetingUri = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.uri')).value);
        window.framework.addNotification('info', 'Joining conference...');

        conversation = conversationsManager.getConversationByUri(meetingUri);

        const isActiveSpeakerMode = conversation.videoService.videoMode() == 'ActiveSpeaker';

        const vidUtils = VideoUtils(conversation, content, listeners, 1, 3, reset);

        vidUtils.setUpListeners();
        vidUtils.startVideoService();
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
            goToStep(3);
        }, error => {
            window.framework.addNotification('error', error);
        }).then(() => {
            reset(true);
        });
    }

    function goToStep(step) {
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step' + step)).style.display = 'block';
    }

    window.framework.registerNavigation(reset);

    window.framework.addEventListener(content.querySelector('.call'), 'click', joinMeeting);    
    window.framework.addEventListener(content.querySelector('.end'), 'click', endConversation);
    window.framework.addEventListener(content.querySelector('.restart'), 'click', restart);
})();

