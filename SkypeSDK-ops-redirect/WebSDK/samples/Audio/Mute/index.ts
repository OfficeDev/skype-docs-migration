/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAudioMute.md' : 'Content/websdk/docs/PTAudioMute.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.id')).value = '';
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.mute')).disabled = false;
        (<HTMLInputElement>content.querySelector('.unmute')).disabled = false;
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
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.mute')).disabled = false;
        (<HTMLInputElement>content.querySelector('.unmute')).disabled = false;
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.call'), 'click', () => {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.id')).value) {
            window.framework.addNotification('info', 'Please enter a valid user id');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const conversationsManager = window.framework.application.conversationsManager;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.id')).value);
        window.framework.addNotification('info', 'Sending invitation...');
        conversation = conversationsManager.getConversation(id);

        listeners.push(conversation.selfParticipant.audio.state.when('Connected', () => {
            window.framework.addNotification('success', 'Connected to audio');
        }));
        listeners.push(conversation.participants.added(person => {
            window.framework.addNotification('success', person.displayName() + ' has joined the conversation');
        }));
        listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
            oldValue && newValue && window.framework.addNotification('info', 'Conversation state changed from ' + oldValue + ' to ' + newValue);
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                window.framework.addNotification('success', 'Conversation ended');
                (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
                (<HTMLElement>content.querySelector('#step4')).style.display = 'block';
                reset(true);
            }
        }));

        conversation.audioService.start().then(null, error => {
            window.framework.addNotification('error', error);
            if (error.code && error.code == 'PluginNotInstalled') {
                window.framework.addNotification('info', 'You can install the plugin from:');
                window.framework.addNotification('info', '(Windows) https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeMeetingsApp.msi');
                window.framework.addNotification('info', '(Mac) https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeForBusinessPlugin.pkg');
            }
        });
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'block';
    });

    window.framework.addEventListener(content.querySelector('.mute'), 'click', () => {
        (<HTMLInputElement>content.querySelector('.mute')).disabled = true;
        const participant = conversation.selfParticipant;
        window.framework.addNotification('info', 'Muting call...');
        const audio = participant.audio;
        audio.isMuted.set(true).then(() => {
            window.framework.addNotification('success', 'Call muted');
            (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
            (<HTMLInputElement>content.querySelector('.mute')).disabled = false;
        }, error => {
            window.framework.addNotification('error', error);
        });
    });

    window.framework.addEventListener(content.querySelector('.unmute'), 'click', () => {
        (<HTMLInputElement>content.querySelector('.unmute')).disabled = true;
        const participant = conversation.selfParticipant;
        window.framework.addNotification('info', 'Unmuting call...');
        const audio = participant.audio;
        audio.isMuted.set(false).then(() => {
            window.framework.addNotification('success', 'Call unmuted');
            (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step2')).style.display = 'block';
            (<HTMLInputElement>content.querySelector('.unmute')).disabled = false;
        }, error => {
            window.framework.addNotification('error', error);
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
            (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step4')).style.display = 'block';
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
