/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.subject'));

    function reset () {
        (<HTMLInputElement>content.querySelector('.subject')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.schedule'), 'click', function () {
        const conversationsManager = window.framework.application.conversationsManager;
        const subject = (<HTMLInputElement>content.querySelector('.subject')).value;
        const onlineMeetingUri = <HTMLInputElement>content.querySelector('.onlineMeetingUri');
        const joinUrl = <HTMLInputElement>content.querySelector('.joinUrl');
        onlineMeetingUri.value = '';
        joinUrl.value = '';
        window.framework.reportStatus('Scheduling Meeting...', window.framework.status.info);
        // @snippet
        const meeting = conversationsManager.createMeeting();
        meeting.subject(subject);
        meeting.accessLevel('Everyone');
        meeting.onlineMeetingUri.get().then(uri => {
            onlineMeetingUri.value = uri;
            joinUrl.value = meeting.joinUrl();
            window.framework.reportStatus('Meeting Scheduled', window.framework.status.success);
        }, error => {
            window.framework.reportError(error, reset);
        });
        // @end_snippet
    });
})();
