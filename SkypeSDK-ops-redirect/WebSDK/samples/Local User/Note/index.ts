/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTLocalUserNote.md' : 'Content/websdk/docs/PTLocalUserNote.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.message'));

    function reset () {
        (<HTMLInputElement>content.querySelector('.message')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.set'), 'click', () => {
        const message = (<HTMLInputElement>content.querySelector('.message')).value;
        const application = window.framework.application;
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'block';
        window.framework.updateNotification('info', 'Changing Note...');
        const mePerson = application.personsAndGroupsManager.mePerson;
        mePerson.note.text.set(message).then(() => {
            window.framework.updateNotification('success', 'Note Changed');
        }, error => {
            window.framework.updateNotification('error', error);
        }).then(reset);
    });
})();
