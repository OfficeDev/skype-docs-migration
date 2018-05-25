/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTLocalUserDashboard.md' : 'Content/websdk/docs/PTLocalUserDashboard.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    function reset () {
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';
        (<HTMLElement>content.querySelector('.contacts')).innerHTML = '';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.get'), 'click', () => {
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'block';
        (<HTMLElement>content.querySelector('.contacts')).innerHTML = '';
        (<HTMLElement>content.querySelector('.contactcard')).innerHTML = '';
        const application = window.framework.application;
        const mePerson = application.personsAndGroupsManager.mePerson;
        const contactsDiv = <HTMLElement>content.querySelector('.contacts');
        const mePersonArray = []; mePersonArray.push(mePerson);
        contactsDiv.innerHTML = '';
        window.framework.populateContacts(mePersonArray, contactsDiv);
        window.framework.createContactCard(mePerson, <HTMLElement>contactsDiv.querySelector('.contact'));
        window.framework.createContactCard(mePerson, <HTMLElement>content.querySelector('.contactcard'));
        window.framework.updateNotification('success', 'Dashboard Loaded');
    });
})();
