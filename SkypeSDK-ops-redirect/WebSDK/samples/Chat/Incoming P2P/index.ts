/// <reference path="../../../framework.d.ts" />
declare var mui: any;
(function () {
    'use strict';
    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTChatIncomingP2P.md' : 'Content/websdk/docs/PTChatIncomingP2P.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.messageToSend'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.messageToSend')).value = '';
        (<HTMLElement>content.querySelector('.messages')).innerHTML = '';
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
        (<HTMLElement>content.querySelector('#bimessages')).style.display = 'none';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.add'), 'click', () => {
        const conversationsManager = window.framework.application.conversationsManager;
        window.framework.showNotificationBar();
        window.framework.addNotification('info', 'Waiting for invitation...');
        listeners.push(conversationsManager.conversations.added(conv => {
            conversation = conv;
            listeners.push(conversation.chatService.accept.enabled.when(true, () => {
                window.framework.showModal('Accept incoming chat invitation?');
                const checkPopupResponse = () => {
                    if (window.framework.popupResponse === 'undefined') {
                        setTimeout(checkPopupResponse, 100);
                    } else {
                        if (window.framework.popupResponse === 'yes') {
                            window.framework.popupResponse = 'undefined';
                            window.framework.addNotification('info', 'Invitation Accepted');
                            conversation.chatService.accept();
                            listeners.push(conversation.participants.added(person => {
                                window.framework.addNotification('success', person.displayName() + ' has joined the conversation');
                            }));
                            listeners.push(conversation.chatService.messages.added(item => {
                                window.framework.addMessage(item, <HTMLElement>content.querySelector('.messages'));
                            }));
                            (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
                            (<HTMLElement>content.querySelector('#step2')).style.display = 'block';
                        } else {
                            window.framework.popupResponse = 'undefined';
                            window.framework.addNotification('error', 'Invitation Rejected');
                            conversation.chatService.reject();
                            reset(true);
                            restart();
                        }
                    }
                }
                checkPopupResponse();
            }));
            listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
                if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                    window.framework.addNotification('info', 'Conversation ended');
                    reset(true);
                }
            }));
        }));
    });

    window.framework.addEventListener(content.querySelector('.send'), 'click', () => {
        const message = <HTMLInputElement>content.querySelector('.messageToSend');
        conversation.chatService.sendMessage(message.value).then(() => {
            message.value = '';
            (<HTMLElement>content.querySelector('#bimessages')).style.display = 'block';
        });
    });

    window.framework.addEventListener(content.querySelector('.end'), 'click', () => {
        window.framework.addNotification('info', 'Ending conversation...');
        if (!conversation) {
            reset(true);
            restart();
            return;
        }
        conversation.leave().then(() => {
            window.framework.addNotification('error', 'Conversation ended');
            (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
            (<HTMLElement>content.querySelector('#bimessages')).style.display = 'none';
        }, error => {
            window.framework.addNotification('error', error);
        }).then(function () {
            reset(true);
        });
    });

    window.framework.addEventListener(content.querySelector('.restart'), 'click', () => {
        restart();
    });
})();
