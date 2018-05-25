/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    window.framework.hideNotificationBar();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTChatGroup.md' : 'Content/websdk/docs/PTChatGroup.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id2'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.messageToSend'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.id')).value = '';
        (<HTMLInputElement>content.querySelector('.id2')).value = '';
        (<HTMLInputElement>content.querySelector('.messageToSend')).value = '';
        (<HTMLElement>content.querySelector('.messages')).innerHTML = '';
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
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.call'), 'click', () => {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.id')).value || !(<HTMLInputElement>content.querySelector('.id2')).value) {
            window.framework.addNotification('info', 'Please enter valid user ids');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const conversationsManager = window.framework.application.conversationsManager;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.id')).value);
        const id2 = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.id2')).value);

        window.framework.addNotification('info', 'Inviting participants...');
        conversation = conversationsManager.createConversation();

        listeners.push(conversation.selfParticipant.chat.state.when('Connected', () => {
            window.framework.addNotification('success', 'Connected to Chat');
        }));
        listeners.push(conversation.participants.added(person => {
            window.framework.addNotification('success', person.displayName() + ' has joined the conversation');
        }));
        listeners.push(conversation.participants.removed(person => {
            window.framework.addNotification('info', person.displayName() + ' has left the conversation');
            conversation.participants.size() === 0 && window.framework.addNotification('alert', 'You are the only one in this conversation. You can end this conversation and start a new one.');
        }));
        listeners.push(conversation.chatService.messages.added(item => {
            window.framework.addMessage(item, <HTMLElement>content.querySelector('.messages'));
        }));
        listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                window.framework.addNotification('info', 'Conversation ended');
                reset(true);
            }
        }));

        conversation.participants.add(id);
        conversation.participants.add(id2);
        conversation.chatService.start().then(null, error => {
            window.framework.addNotification('error', error);
            reset(true);
        });
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'block';
    });

    window.framework.addEventListener(content.querySelector('.send'), 'click', () => {
        const message = <HTMLInputElement>content.querySelector('.messageToSend');
        conversation.chatService.sendMessage(message.value).then(function () {
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
            window.framework.reportStatus('Conversation Ended', window.framework.status.reset);
            window.framework.addNotification('success', 'Conversation ended');
            (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
            (<HTMLElement>content.querySelector('#bimessages')).style.display = 'none';
        }, window.framework.reportError).then(() => {
            reset(true);
        });
    });

    window.framework.addEventListener(content.querySelector('.restart'), 'click', () => {
        restart();
    });
})();
