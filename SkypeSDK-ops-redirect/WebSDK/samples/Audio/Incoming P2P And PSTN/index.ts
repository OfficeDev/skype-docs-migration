/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAudioIncoming.md' : 'Content/websdk/docs/PTAudioIncoming.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    function cleanUI() {
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
        (<HTMLElement>content.querySelector('#step1')).style.display = 'block';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.add'), 'click', () => {
        const conversationsManager = window.framework.application.conversationsManager;
        window.framework.showNotificationBar();
        window.framework.addNotification('info', 'Waiting for invitation...');

        listeners.push(conversationsManager.conversations.added(conv => {
            conversation = conv;
            listeners.push(conversation.audioService.accept.enabled.when(true, () => {
                window.framework.showModal('Accept incoming audio invitation?');
                const checkPopupResponse = () => {
                    if (window.framework.popupResponse === 'undefined') {
                        setTimeout(checkPopupResponse, 100);
                    } else {
                        if (window.framework.popupResponse === 'yes') {
                            window.framework.popupResponse = 'undefined';
                            window.framework.addNotification('success', 'Invitation accepted');
                            conversation.audioService.accept();
                            listeners.push(conversation.participants.added(person => {
                                window.framework.addNotification('success', person.displayName() + ' has joined the conversation');
                            }));
                        } else {
                            window.framework.popupResponse = 'undefined';
                            window.framework.addNotification('error', 'Invitation rejected');
                            conversation.audioService.reject();
                            reset(true);
                            restart();
                        }
                    }
                }
                checkPopupResponse();
            }));
            listeners.push(conversation.selfParticipant.audio.state.when('Connected', () => {
                window.framework.addNotification('success', 'Connected to audio');
            }));
            listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
                oldValue && newValue && window.framework.addNotification('info', 'Conversation state changed from ' + oldValue + ' to ' + newValue);
                if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                    window.framework.addNotification('info', 'Conversation ended');
                    (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
                    (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
                    reset(true);
                }
            }));
        }));
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'block';
    });

    window.framework.addEventListener(content.querySelector('.end'), 'click', () => {
        window.framework.addNotification('info', 'Ending conversation...');
        if (!conversation) {
            reset(true);
            restart();
            return;
        }
        conversation.leave().then(() => {
            window.framework.addNotification('success', 'Conversation ended');
            (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
        }, error => {
            window.framework.addNotification('error', error);
        }).then(() => {
            reset(true);
        });
    });

    window.framework.addEventListener(content.querySelector('.restart'), 'click', () => {
        restart();
    });
})();
