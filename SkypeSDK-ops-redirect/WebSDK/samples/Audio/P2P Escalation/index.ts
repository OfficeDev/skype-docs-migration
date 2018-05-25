/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAudioP2PEscalation.md' : 'Content/websdk/docs/PTAudioP2PEscalation.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [],
        inCall = false,
        participantAdded = false,
        callButton = <HTMLInputElement>content.querySelector('.call');

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.sip')).value = '';
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

        inCall = false;
        participantAdded = false;
        callButton.innerHTML = 'Start Audio Call'

        if (conversation) {
            if (bySample) {
                cleanupConversation();
                cleanUI();
            } else {
                const result = window.confirm('Leaving this sample will end the conversation.  Do you really want to leave?');
                if (result) {
                    cleanupConversation();
                    cleanUI();
                }

                return result;
            }
        } else {
            cleanUI();
        }
    }

    function makeCall() {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.sip')).value) {
            window.framework.addNotification('info', 'Please enter a valid user id');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.sip')).value);
        const conversationsManager = window.framework.application.conversationsManager;

        if (!id) {
            window.framework.addNotification('error', 'SIP Address is not specified');
            return;
        }

        window.framework.addNotification('info', 'Sending Invitation');
        conversation = conversationsManager.getConversation(id);

        listeners.push(conversation.selfParticipant.audio.state.when('Connected', () => {
            window.framework.addNotification('success', 'Connected to Audio');
            inCall = true;
            callButton.innerHTML = 'Add participant';
            (<HTMLInputElement>content.querySelector('.call')).disabled = false;
            (<HTMLInputElement>content.querySelector('.sip')).value = '';
        }));

        listeners.push(conversation.participants.added(person => {
            window.framework.addNotification('info', person.displayName() + ' has joined the conversation');
        }));

        listeners.push(conversation.participants.removed(person => {
            window.framework.addNotification('info', person.displayName() + ' has left the conversation');
            conversation.participants.size() === 0 && window.framework.addNotification('alert', 'You are the only one in this conversation. You can end this conversation and start a new one.');
        }));

        listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                window.framework.addNotification('info', 'Conversation Ended');
                reset(true);
            }
        }));

        conversation.audioService.start().then(null, error => {
            window.framework.updateNotification('error', error & error.message);
            if (error.code && error.code == 'PluginNotInstalled') {
                window.framework.addNotification('info', 'You can install the plugin from:');
                window.framework.addNotification('info', '(Windows) https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeMeetingsApp.msi');
                window.framework.addNotification('info', '(Mac) https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeForBusinessPlugin.pkg');
            }
        });
    }

    function addParticipant() {
        if (!(<HTMLInputElement>content.querySelector('.sip')).value) {
            window.framework.addNotification('info', 'Please enter a valid user id');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.sip')).value);

        if (!id) {
            window.framework.addNotification('error', 'SIP Address is not specified');
            return;
        }

        window.framework.addNotification('info', 'Adding Participant...');
        conversation.participants.add(id).then(() => {
            window.framework.addNotification('success', 'Participant Added.');
            participantAdded = true;
            callButton.innerHTML = 'End Call';
            (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        }, error => {
            window.framework.addNotification('error', error && error.message);
        });
    }

    function endCall() {
        window.framework.addNotification('info', 'Ending Conversation ...');
        if (!conversation) {
            reset(true);
            return;
        }
        conversation.leave().then(() => {
            window.framework.addNotification('success', 'Conversation Ended');
        }, error => {
            window.framework.addNotification('error', error && error.message);
        }).then(() => {
            reset(true);
        });
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(callButton, 'click', () => {
        if (!inCall) {
            return makeCall();
        }

        if (!participantAdded) {
            return addParticipant();
        }

        endCall();
    });
})();