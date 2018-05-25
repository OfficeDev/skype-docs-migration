/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    var application;
    var conversation;
    var listeners = [];

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.username'));
    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.uri'));

    function cleanUI () {
        (<HTMLInputElement>content.querySelector('.username')).value = '';
        (<HTMLInputElement>content.querySelector('.uri')).value = '';
        (<HTMLElement>content.querySelector('.videoContainer')).innerHTML = '';
    }

    function cleanupConversation () {
        if (conversation.state() !== 'Disconnected') {
            conversation.leave().then(() => {
                conversation = null;
            });
        } else {
            conversation = null;
        }
    }

    function reset (bySample: Boolean) {
        // remove any outstanding event listeners
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].dispose();
        }
        listeners = [];

        if (conversation)
        {
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

        if (application) {
            application.signInManager.signOut();
        }
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.signin'), 'click', () => {
        const version = config.version;
        const username = (<HTMLInputElement>content.querySelector('.username')).value;
        const uri = (<HTMLInputElement>content.querySelector('.uri')).value;
        const api = window.framework.api;
        window.framework.reportStatus('Joining Meeting...', window.framework.status.info);
        // @snippet
        application = new api.application();
        application.signInManager.signIn({
            version: version,
            name: username,
            meeting: uri
        }).then(() => {
            window.framework.reportStatus('Signed In, Anonymously', window.framework.status.success);
        }, error => {
            window.framework.reportError(error, reset);
        });
        // @end_snippet
    });
    window.framework.addEventListener(content.querySelector('.join'), 'click', () => {
        const conversationsManager = application.conversationsManager;
        const uri = (<HTMLInputElement>content.querySelector('.uri')).value;
        window.framework.reportStatus('Joining Meeting...', window.framework.status.info);
        // @snippet
        conversation = conversationsManager.getConversationByUri(uri);

        function setupContainer (person: jCafe.Participant, size: string) {
            const div = window.framework.createVideoContainer(<HTMLElement>content.querySelector('.videoContainer'), size, person);
            person.video.channels(0).stream.source.sink.format('Stretch');
            person.video.channels(0).stream.source.sink.container(div);
        }

        listeners.push(conversation.selfParticipant.video.state.when('Connected', () => {
            setupContainer(conversation.selfParticipant, 'large');

            window.framework.reportStatus('Connected to Video', window.framework.status.success);

            listeners.push(conversation.participants.added(person => {
                window.console.log(person.displayName() + ' has joined the conversation');

                listeners.push(person.video.state.when('Connected', () => {
                    setupContainer(person, 'large');

                    person.video.channels(0).isStarted(true);
                }));
            }));
        }));
        listeners.push(conversation.state.changed((newValue, reason, oldValue) => {
            if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                window.framework.reportStatus('Conversation Ended', window.framework.status.reset);
                reset(true);
            }
        }));

        conversation.videoService.start().then(null, error => {
            window.framework.reportError(error, reset);
        });
        // @end_snippet
    });
    window.framework.addEventListener(content.querySelector('.end'), 'click', () => {
       window.framework.reportStatus('Ending Conversation...', window.framework.status.info);
        // @snippet
        conversation.leave().then(() => {
            window.framework.reportStatus('Conversation Ended', window.framework.status.reset);
        }, error => {
            window.framework.reportError(error);
        }).then(() => {
            reset(true);
        });
        // @end_snippet
    });
})();
