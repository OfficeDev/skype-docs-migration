/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTUIControlsConversationControl.md' : 'Content/websdk/docs/PTUIControlsConversationControl.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    var app = window.framework.application,
        renderedConversations = [], // Represents **rendered** conversations
        listeners = [],
        listeningForIncoming = false,
        callButton = <HTMLInputElement>content.querySelector('.call'),
        // listenButton = <HTMLInputElement>content.querySelector('.incoming'),
        step = 1, // Keep track of what UI section to dislpay
        ccNumber = 1;

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.sip1'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.sip2'));
    (<HTMLElement>content.querySelector('#conversationcontrol')).style.display = 'none';

    function cleanUI() {
        (<HTMLInputElement>content.querySelector('.sip1')).value = '';
        (<HTMLInputElement>content.querySelector('.sip2')).value = '';
        (<HTMLElement>content.querySelector('.conversationContainer')).innerHTML = '';
        (<HTMLElement>content.querySelector('#conversationcontrol')).style.display = 'none';

        callButton.innerHTML = 'Create Control';
        callButton.disabled = false;
        // listenButton.innerHTML = 'Start Listening';
        // listenButton.disabled = false;

        (<HTMLInputElement>content.querySelector('.endAllConvs')).style.display = 'none';
        (<HTMLInputElement>content.querySelector('.sip1')).value = '';
        (<HTMLInputElement>content.querySelector('.sip2')).value = '';
    }

    function cleanupConversations() {
        for (const rc of renderedConversations) {
            cleanupConversation(rc);
        }
        renderedConversations = [];
    }

    function cleanupConversation(conversation) {
        if (conversation.state() !== 'Disconnected') {
            conversation.leave();
        }
    }

    function reset(bySample: Boolean) {
        window.framework.hideNotificationBar();
        content.querySelector('.notification-bar').innerHTML = '<br/> <div class="mui--text-subhead"><b>Events Timeline</b></div> <br/>'
        ccNumber = 1;
        gotoStep(1);

        // remove any outstanding event listeners
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].dispose();
        }
        listeners = [];
        listeningForIncoming = false;

        cleanCCs(bySample);
    }

    function cleanCCs(bySample: Boolean) {
        if (renderedConversations.length > 0) {
            if (bySample) {
                cleanupConversations();
                cleanUI();
            } else {
                const result = window.confirm('Leaving this sample will end the conversation.  Do you really want to leave?');
                if (result) {
                    cleanupConversations();
                    cleanUI();
                }

                return result;
            }
        } else {
            cleanUI();
        }
    }

    function startOutgoingCall() {
        (<HTMLInputElement>content.querySelector('.call')).disabled = true;
        const conversationsManager = app.conversationsManager;
        const id1 = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.sip1')).value);
        const id2 = window.framework.updateUserIdInput((<HTMLInputElement>content.querySelector('.sip2')).value);

        var participants = [];

        if (id1 !== '') {
            participants.push(id1);
        }
        if (id2 !== '') {
            participants.push(id2);
        }

        if (!id1 && !id2) {
            window.framework.showNotificationBar();
            window.framework.addNotification('error', 'Must specify at least 1 SIP Address');
            return;
        }

        createCC({
            participants: participants,
            modalities: ['Chat']
        }, 'Outgoing');
    }

    function listenForIncoming() {
        if (listeningForIncoming)
            return;

        listeningForIncoming = true;
        // listenButton.disabled = true;
        // listenButton.innerHTML= 'Listening...';

        // Render incoming call with Conversation control
        listeners.push(app.conversationsManager.conversations.added((conv) => {
            var chatState = conv.selfParticipant.chat.state;
            var audioState = conv.selfParticipant.audio.state;
            if (chatState() != 'Notified' && audioState() != 'Notified') {
                listeners.push(chatState.when('Notified', () => startIncomingCall(conv)));
                listeners.push(audioState.when('Notified', () => startIncomingCall(conv)));
                // This is probably a leftover disconnected conversation; don't render
                // it yet, but listen in case the modalities become Notified again.
                return;
            }
            startIncomingCall(conv);
        }));
    }

    function startIncomingCall(conv) {
        // Only allow start if not already in 'conversations'
        for (const rc of renderedConversations) {
            if (rc === conv)
                return;
        }

        // Avoid rendering twice if both audio and chat are notified simultaneously
        renderedConversations.push(conv);

        // Options for renderConversation
        var options: any = {}

        if (conv.isGroupConversation()) {
            options.conversationId = conv.uri();
        } else {
            var participants = [];
            participants.push(conv.participants(0).person.id());
            options.participants = participants;
        }

        options.modalities = ['Chat']; // TODO: adding audio or video causes renderConversation to fail
        createCC(options, 'Incoming');
    }

    function createCC(options, direction) {
        window.framework.showNotificationBar();

        window.framework.addNotification('info', 'Creating Control...');
        const div = document.createElement('div');
        var control = <HTMLElement>content.querySelector('.conversationContainer');
        control.appendChild(document.createTextNode('Conversation Control #' + ccNumber));
        ccNumber++;
        control.appendChild(div);
        const divider = document.createElement('div');
        divider.className = 'mui-divider';
        control.appendChild(divider);
        (<HTMLElement>content.querySelector('#conversationcontrol')).style.display = 'block';

        window.framework.api.renderConversation(div, options).then(conv => {
            if (direction === 'Outgoing')
                renderedConversations.push(conv);

            listeners.push(conv.selfParticipant.chat.state.when('Connected', () => {
                window.framework.addNotification('success', 'Connected to Chat');
            }));

            listeners.push(conv.participants.added(p => {
                window.framework.addNotification('info', p.person.displayName() + ' has joined the conversation');
            }));

            listeners.push(conv.state.changed((newValue, reason, oldValue) => {
                window.framework.addNotification('info', 'Conversation state changed from ' + oldValue + ' to ' + newValue);

                if (newValue === 'Connected' || newValue === 'Conferenced') {
                    enableInCall(conv);
                }
                if (newValue === 'Disconnected' && (
                    oldValue === 'Connected' || oldValue === 'Connecting' ||
                    oldValue === 'Conferenced' || oldValue === 'Conferencing')) {
                    window.framework.addNotification('info', 'Conversation disconnected');
                    checkRestart();
                }
            }));

            window.framework.addNotification('success', 'Control Created');
            (<HTMLInputElement>content.querySelector('.call')).disabled = false;
            (<HTMLInputElement>content.querySelector('.sip1')).value = '';

            // Decide whether to start or accept
            startOrAcceptModalities(conv, options);

        }, error => {
            window.framework.addNotification('error', 'Failed to create conversation control');
        });
    }

    function startOrAcceptModalities(conv, options) {
        const chatState = conv.selfParticipant.chat.state,
            audioState = conv.selfParticipant.audio.state,
            videoState = conv.selfParticipant.video.state;

        if (chatState() == 'Notified' || audioState() == 'Notified') {
            if (chatState() == 'Notified')
                monitor(conv.chatService.accept(), 'chatService', 'accept');
            if (videoState() == 'Notified')
                monitor(conv.videoService.accept(), 'videoService', 'accept');
            else if (audioState() == 'Notified')
                monitor(conv.audioService.accept(), 'audioService', 'accept');
        }
        else {
            if (options.modalities.indexOf('Chat') >= 0)
                monitor(conv.chatService.start(), 'chatService', 'start');
            if (options.modalities.indexOf('Video') >= 0)
                monitor(conv.videoService.start(), 'videoService', 'start');
            else if (options.modalities.indexOf('Audio') >= 0)
                monitor(conv.audioService.start(), 'audioService', 'start');
        }
    }

    function endCall(conversation) {
        window.framework.addNotification('info', 'Ending conversation ...');

        conversation.leave().then(() => {
            window.framework.addNotification('success', 'Conversation ended.');
            cleanCCs(true);
            allowRestart();
        }, error => {
            window.framework.addNotification('error', 'End Conversation: ' + (error ? error.message : ''));
        });
    }

    function checkRestart() {
        for (const rc of renderedConversations) {
            if (rc.state() !== 'Disconnected')
                return;
        }
        allowRestart();
    }

    function allowRestart() {
        const resetButton = <HTMLInputElement>content.querySelector('.restart');
        gotoStep(2);

        window.framework.addEventListener(resetButton, 'click', reset);
    }

    function enableInCall(conv) {
        const endCallButton = <HTMLInputElement>content.querySelector('.endAllConvs');
        endCallButton.style.display = 'block';

        window.framework.addEventListener(endCallButton, 'click', () => endCall(conv));
    }

    function gotoStep(n) {
        // console.log('step: ' + n);
        disableStep(step);
        step = n;
        enableStep(step);
    }

    function enableStep(n) {
        (<HTMLElement>content.querySelector('#step' + n)).style.display = 'block';
    }

    function disableStep(n) {
        (<HTMLElement>content.querySelector('#step' + n)).style.display = 'none';
    }

    function monitor(dfd, service, method) {
        dfd.then(() => {
            window.framework.addNotification('success', service + ' ' + method + 'ed successfully. Call connected');
        }, error => {
            window.framework.addNotification('error', service + ':' + method + ' - ' + (error ? error.message : 'unknown'));
        });
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(callButton, 'click', startOutgoingCall);
    // window.framework.addEventListener(listenButton, 'click', listenForIncoming);
})();
