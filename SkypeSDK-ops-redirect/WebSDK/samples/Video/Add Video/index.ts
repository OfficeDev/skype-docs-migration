/// <reference path="../../../framework.d.ts" />
/// <reference path="../../utils/video-utils.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTVideoAddVideo.md' : 'Content/websdk/docs/PTVideoAddVideo.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var conversation;
    var listeners = [];

    var vidUtils;

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.id'));

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.id')).value = '';
        (<HTMLElement>content.querySelector('.selfVideoContainer')).innerHTML = '';
        (<HTMLElement>content.querySelector('.remoteVideoContainers')).innerHTML = '';
        (<HTMLElement>content.querySelector('#selfvideo')).style.display = 'none';
        (<HTMLElement>content.querySelector('#remotevideo')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.add')).disabled = false;
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
        (<HTMLInputElement>content.querySelector('.call')).disabled = false;
        (<HTMLInputElement>content.querySelector('.add')).disabled = false;
    }

    function startCall () {
        window.framework.showNotificationBar();
        if (!(<HTMLInputElement>content.querySelector('.id')).value) {
            window.framework.addNotification('info', 'Please enter a valid user id');
            return;
        }

        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const id = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.id')).value);
        const conversationsManager = window.framework.application.conversationsManager;
        conversation = conversationsManager.getConversation(id);
        window.framework.addNotification('info', 'Sending invitation...');

        vidUtils = VideoUtils(conversation, content, listeners, 2, 4, reset);

        vidUtils.setUpListeners();

        listeners.push(conversation.selfParticipant.audio.state.when('Connected', () => {
            window.framework.addNotification('success', 'Connected to audio');
        }));

        conversation.audioService.start().then(null, error => {
            window.framework.addNotification('error', error);
            if (error.code && error.code == 'PluginNotInstalled') {
                window.framework.addNotification('info', 'You can install the plugin from:');
                window.framework.addNotification('info', '(Windows) https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeMeetingsApp.msi');
                window.framework.addNotification('info', '(Mac) https://swx.cdn.skype.com/s4b-plugin/16.2.0.67/SkypeForBusinessPlugin.pkg');
            }
        });
        goToStep(2);
    }

    function addVideo () {
        (<HTMLInputElement>content.querySelector('.add')).disabled = true;
        window.framework.addNotification('info', 'Adding video...');

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
            goToStep(4)
        }, error => {
            window.framework.addNotification('error', error);
        }).then(() => {
            reset(true);
        });
    }
    
    window.framework.registerNavigation(reset);

    window.framework.addEventListener(content.querySelector('.call'), 'click', startCall);    
    window.framework.addEventListener(content.querySelector('.add'), 'click', addVideo);    
    window.framework.addEventListener(content.querySelector('.end'), 'click', endConversation);
    window.framework.addEventListener(content.querySelector('.restart'), 'click', restart);

    function goToStep(step) {
        (<HTMLElement>content.querySelector('#step1')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step2')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step3')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step4')).style.display = 'none';
        (<HTMLElement>content.querySelector('#step' + step)).style.display = 'block';
    }
})();