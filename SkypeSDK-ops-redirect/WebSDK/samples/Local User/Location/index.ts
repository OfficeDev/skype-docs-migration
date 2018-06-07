/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTLocalUserLocation.md' : 'Content/websdk/docs/PTLocalUserLocation.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    window.framework.bindInputToEnter(<HTMLInputElement>content.querySelector('.location'));

    function reset () {
        (<HTMLInputElement>content.querySelector('.location')).value = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.set'), 'click', () => {
        const location = (<HTMLInputElement>content.querySelector('.location')).value;
        const application = window.framework.application;
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'block';
        window.framework.updateNotification('info', 'Changing Location...');
        const mePerson = application.personsAndGroupsManager.mePerson;
        mePerson.location.set(location).then(() => {
            window.framework.updateNotification('success', 'Location Changed');
        }, error => {
            window.framework.updateNotification('error', error);
        }).then(reset);
    });
})();
