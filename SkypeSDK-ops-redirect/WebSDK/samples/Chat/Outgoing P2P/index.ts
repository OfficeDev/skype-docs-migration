/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTChatOutgoingP2P.md' : 'Content/websdk/docs/PTChatOutgoingP2P.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.messageToSend'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.messageToSend2'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.id')).value = '';
        (<HTMLInputElement>content.querySelector('.messageToSend')).value = '';
        (<HTMLInputElement>content.querySelector('.messageToSend2')).value = '';
        (<HTMLElement>content.querySelector('.messages')).innerHTML = '';
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.send')).disabled = false;
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
        (<HTMLElement>content.querySelector('#step4')).style.display = 'none';
        (<HTMLElement>content.querySelector('#outgoingmessages')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.send')).disabled = false;
    }

    window.framework.registerNavigation(reset);

    window.framework.addEventListener(content.querySelector('.call'), 'click', () => {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.id')).value) {
            window.framework.addNotification('info', 'Please enter a valid user id');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.id')).value);
        const conversationsManager = window.framework.application.conversationsManager;
        conversation = conversationsManager.getConversation(id);

        listeners.push(conversation.selfParticipant.chat.state.when('Connected', () => {
            window.framework.addNotification('success', 'Connected to Chat');
        }));
        listeners.push(conversation.participants.added(person => {
            window.framework.addNotification('success', person.displayName() + ' has joined the conversation');
        }));
        listeners.push(conversation.chatService.messages.added(item => {
            window.framework.addMessage(item, <HTMLElement>content.querySelector('.messages'));
        }));
        listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                window.framework.addNotification('info', 'Conversation ended');
                reset(true);
                restart();
            }
        }));
        window.framework.addNotification('info', 'Events subscribed');
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'block';
    });

    window.framework.addEventListener(content.querySelector('.send'), 'click', () => {
        (<HTMLInputElement>content.querySelector('.send')).disabled = true;
        const message = <HTMLInputElement>content.querySelector('.messageToSend');
        window.framework.addNotification('info', 'Sending invitation...');
        conversation.chatService.sendMessage(message.value).then(() => {
            message.value = '';
            (<HTMLElement>content.querySelector('#outgoingmessages')).style.display = 'block';
        }, error => {
            window.framework.addNotification('error', error);
        });
        (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
    });

    window.framework.addEventListener(content.querySelector('.send2'), 'click', () => {
        const message = <HTMLInputElement>content.querySelector('.messageToSend2');
        conversation.chatService.sendMessage(message.value).then(() => {
            message.value = '';
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
            window.framework.addNotification('success', 'Conversation ended');
            (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step4')).style.display = 'block';
            (<HTMLElement>content.querySelector('#outgoingmessages')).style.display = 'none';
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
