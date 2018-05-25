/// <reference path="../../../framework.d.ts" />
/// <reference path="../../utils/video-utils.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTVideoIncomingP2P.md' : 'Content/websdk/docs/PTVideoIncomingP2P.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    function cleanUI() {
        (<HTMLElement>content.querySelector('.selfVideoContainer')).innerHTML = '';
        (<HTMLElement>content.querySelector('.remoteVideoContainers')).innerHTML = '';
        (<HTMLElement>content.querySelector('#selfvideo')).style.display = 'none';
        (<HTMLElement>content.querySelector('#remotevideo')).style.display = 'none';
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
        (<HTMLInputElement>content.querySelector('.listen')).disabled = false;
    }

    function listenForIncomingCall () {
        const conversationsManager = window.framework.application.conversationsManager;
        window.framework.showNotificationBar();
        window.framework.addNotification('info', 'Waiting for invitation...');
        (<HTMLInputElement>content.querySelector('.listen')).disabled = true;        

        listeners.push(conversationsManager.conversations.added(conv => {
            conversation = conv;
            
            const vidUtils = VideoUtils(conversation, content, listeners, 1, 3, reset);

            vidUtils.setUpListeners();

            listeners.push(conversation.videoService.accept.enabled.when(true, () => {
                window.framework.showModal('Accept incoming video invitation?');
                const checkPopupResponse = () => {
                    if (window.framework.popupResponse === 'undefined') {
                        setTimeout(checkPopupResponse, 100);
                    } else {
                        if (window.framework.popupResponse === 'yes') {
                            window.framework.popupResponse = 'undefined';
                            window.framework.addNotification('success', 'Invitation accepted');

                            conversation.videoService.accept();
                            goToStep(2);
                        } else {
                            window.framework.popupResponse = 'undefined';
                            window.framework.addNotification('error', 'Invitation rejected');
                            conversation.videoService.reject();
                            reset(true);
                            restart();
                        }
                    }
                }
                checkPopupResponse();
            }));
        }));
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

    window.framework.registerNavigation(reset);

    window.framework.addEventListener(content.querySelector('.listen'), 'click', listenForIncomingCall);    
    window.framework.addEventListener(content.querySelector('.end'), 'click', endConversation);
    window.framework.addEventListener(content.querySelector('.restart'), 'click', restart);

    function goToStep(step) {
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step' + step)).style.display = 'block';
    }
})();
