/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    let status: string = '';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTLocalUserStatus.md' : 'Content/websdk/docs/PTLocalUserStatus.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    function reset () {
        (<HTMLInputElement>content.querySelector('.selectedstatus')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.set'), 'click', () => {
        const application = window.framework.application;
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'block';
        window.framework.updateNotification('info', 'Changing Status...');
        const mePerson = application.personsAndGroupsManager.mePerson;
        mePerson.status.set(status).then(() => {
            window.framework.updateNotification('success', 'Status Changed');
        }, error => {
            window.framework.updateNotification('error', error);
        }).then(reset);
    });

    window.framework.addEventListener(content.querySelector('.online'), 'click', () => {
        status = 'Online';
        (<HTMLInputElement>content.querySelector('.selectedstatus')).value = 'Online';
    });
    window.framework.addEventListener(content.querySelector('.away'), 'click', () => {
        status = 'Away';
        (<HTMLInputElement>content.querySelector('.selectedstatus')).value = 'Away';
    });
    window.framework.addEventListener(content.querySelector('.busy'), 'click', () => {
        status = 'Busy';
        (<HTMLInputElement>content.querySelector('.selectedstatus')).value = 'Busy';
    });
    window.framework.addEventListener(content.querySelector('.brb'), 'click', () => {
        status = 'BeRightBack';
        (<HTMLInputElement>content.querySelector('.selectedstatus')).value = 'BeRightBack';
    });
    window.framework.addEventListener(content.querySelector('.dnb'), 'click', () => {
        status = 'DoNotDisturb';
        (<HTMLInputElement>content.querySelector('.selectedstatus')).value = 'DoNotDisturb';
    });
})();
