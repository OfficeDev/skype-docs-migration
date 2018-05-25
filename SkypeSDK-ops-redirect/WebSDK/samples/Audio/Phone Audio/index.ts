/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTAudioPhoneAudio.md' : 'Content/websdk/docs/PTAudioPhoneAudio.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.tel'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.id')).value = '';
        (<HTMLInputElement>content.querySelector('.tel')).value = '';
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
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
    }

    function cleanRestart() {
        conversation = null;
        reset(true);
        restart();
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.call'), 'click', () => {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.id')).value || !(<HTMLInputElement>content.querySelector('.tel')).value) {
            window.framework.addNotification('info', 'Please enter valid user ids and/or phone numbers');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.id')).value);
        const teluri = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.tel')).value);
        const conversationsManager = window.framework.application.conversationsManager;
        window.framework.addNotification('info', 'Sending invitation...');
        conversation = conversationsManager.getConversation(id);

        listeners.push(conversation.phoneAudioService.state.when('Connected', () => {
            window.framework.addNotification('success', 'Connected to phone audio');
        }));

        listeners.push(conversation.participants.added(person => {
            window.framework.addNotification('success', person.displayName() + ' has joined the conversation');
        }));

        listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
            oldValue && newValue && window.framework.addNotification('info', 'Conversation state changed from ' + oldValue + ' to ' + newValue);
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                window.framework.addNotification('success', 'Conversation ended');
                (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
                (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
                reset(true);
            }
        }));

        conversation.phoneAudioService.start({ teluri: teluri }).then(() => {
            window.framework.addNotification('success', 'Phone audio service started');
        }, error => {
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

    window.framework.addEventListener(content.querySelector('.end'), 'click', () => {
        window.framework.addNotification('info', 'Ending conversation...');
        conversation && conversation.leave().then(() => {
            window.framework.addNotification('success', 'Conversation ended');
            (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
            (<HTMLElement>content.querySelector('#step3')).style.display = 'block';
        }, error => {
            window.framework.addNotification('error', error);
            cleanRestart();
        }).then(() => {
            reset(true);
        });
        !conversation && cleanRestart();
    });

    window.framework.addEventListener(content.querySelector('.restart'), 'click', () => {
        restart();
    });
})();