/// <reference path="../../../framework.d.ts" />
(function () {
    'use strict';

    const content = window.framework.findContentDiv();
    (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'none';

    const mdFileUrl: string = window.framework.getContentLocation() === '/' ? '../../../docs/PTContactsAll.md' : 'Content/websdk/docs/PTContactsAll.md';
    content.querySelector('zero-md').setAttribute('file', mdFileUrl);

    function reset() {
        (<HTMLElement>content.querySelector('.contacts')).innerHTML = '';
        (<HTMLElement>content.querySelector('.contacts')).style.display = 'none';
    }

    window.framework.registerNavigation(reset);
    window.framework.addEventListener(content.querySelector('.get'), 'click', () => {
        reset();
        const contactsDiv = <HTMLElement>content.querySelector('.contacts');
        const application = window.framework.application;
        (<HTMLElement>content.querySelector('.notification-bar')).style.display = 'block';
        window.framework.updateNotification('info', 'Retrieving all contacts...');
        const persons = application.personsAndGroupsManager.all.persons;
        persons.get().then(contacts => {
            contactsDiv.style.display = 'block';
            window.framework.processingStatus = 'processing';
            window.framework.populateContacts(contacts, contactsDiv);
            const checkProcessingStatus = () => {
                if (window.framework.processingStatus === 'processing') {
                    setTimeout(checkProcessingStatus, 100);
                } else {
                    window.framework.processingStatus = 'undefined';
                    window.framework.updateNotification('success', 'Retrieved all contacts');
                }
            }
            checkProcessingStatus();
        }, error => {
            window.framework.updateNotification('error', error);
        });
    });
})();
